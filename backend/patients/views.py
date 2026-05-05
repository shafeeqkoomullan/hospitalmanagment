from django.shortcuts import get_object_or_404
from django.utils.timezone import now

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdmin, IsReceptionistOrAdmin, IsDoctor, IsPatient
from core.utils import log_action

from .models import Patient, MedicalRecord, MedicalReport, Feedback, SupportTicket, Admission
from .serializers import (
    PatientSerializer,
    PatientUpdateSerializer,
    MedicalRecordSerializer,
    MedicalReportSerializer,
    FeedbackSerializer,
    SupportTicketSerializer,
    SupportTicketStatusSerializer,
    AdmissionSerializer,
)


# ── Patient List & Detail (Receptionist / Admin) ──────────────────────────────

class PatientListAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def get(self, request):
        patients = Patient.objects.select_related('user').order_by('-created_at')

        is_blocked = request.query_params.get('is_blocked')
        gender = request.query_params.get('gender')
        search = request.query_params.get('search')

        if is_blocked is not None:
            patients = patients.filter(is_blocked=is_blocked.lower() == 'true')
        if gender:
            patients = patients.filter(gender=gender)
        if search:
            patients = patients.filter(user__username__icontains=search)

        return Response(PatientSerializer(patients, many=True).data)


class PatientDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def get(self, request, pk):
        patient = get_object_or_404(Patient.objects.select_related('user'), pk=pk)
        return Response(PatientSerializer(patient).data)

    def patch(self, request, pk):
        patient = get_object_or_404(Patient, pk=pk)
        serializer = PatientUpdateSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            log_action(actor=request.user, role=request.user.role, action='update', instance=patient, request=request)
            return Response(PatientSerializer(patient).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PatientBlockToggleAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def patch(self, request, pk):
        patient = get_object_or_404(Patient, pk=pk)
        patient.is_blocked = not patient.is_blocked
        patient.save(update_fields=['is_blocked'])
        return Response({"id": patient.id, "is_blocked": patient.is_blocked})


# ── Patient self-profile ──────────────────────────────────────────────────────

class PatientMeAPIView(APIView):
    permission_classes = [IsAuthenticated, IsPatient]

    def get(self, request):
        patient = get_object_or_404(Patient, user=request.user)
        return Response(PatientSerializer(patient).data)

    def patch(self, request):
        patient = get_object_or_404(Patient, user=request.user)
        serializer = PatientUpdateSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(PatientSerializer(patient).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Medical Records ───────────────────────────────────────────────────────────

class MedicalRecordListAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def get(self, request, patient_id):
        patient = get_object_or_404(Patient, id=patient_id)
        records = (
            MedicalRecord.objects
            .filter(patient=patient)
            .select_related('doctor__user')
            .prefetch_related('reports')
            .order_by('-created_at')
        )
        return Response(MedicalRecordSerializer(records, many=True).data)

    def post(self, request, patient_id):
        patient = get_object_or_404(Patient, id=patient_id)
        serializer = MedicalRecordSerializer(data=request.data)
        if serializer.is_valid():
            record = serializer.save(patient=patient)
            log_action(actor=request.user, role=request.user.role, action='create', instance=record, request=request)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MedicalRecordDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def get(self, request, pk):
        record = get_object_or_404(
            MedicalRecord.objects.select_related('doctor__user').prefetch_related('reports'),
            pk=pk
        )
        return Response(MedicalRecordSerializer(record).data)

    def patch(self, request, pk):
        record = get_object_or_404(MedicalRecord, pk=pk)
        serializer = MedicalRecordSerializer(record, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            log_action(actor=request.user, role=request.user.role, action='update', instance=record, request=request)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        record = get_object_or_404(MedicalRecord, pk=pk)
        log_action(actor=request.user, role=request.user.role, action='delete', instance=record, request=request)
        record.delete()
        return Response({"message": "Medical record deleted."}, status=status.HTTP_204_NO_CONTENT)


# ── Medical Reports ───────────────────────────────────────────────────────────

class MedicalReportUploadAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def post(self, request, record_id):
        record = get_object_or_404(MedicalRecord, id=record_id)
        serializer = MedicalReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(medical_record=record)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, record_id):
        report_id = request.data.get('report_id')
        report = get_object_or_404(MedicalReport, id=report_id, medical_record_id=record_id)
        report.delete()
        return Response({"message": "Report deleted."}, status=status.HTTP_204_NO_CONTENT)


# ── Feedback ──────────────────────────────────────────────────────────────────

class FeedbackCreateAPIView(APIView):
    """Patients submit feedback for their doctors."""
    permission_classes = [IsAuthenticated, IsPatient]

    def post(self, request):
        patient = get_object_or_404(Patient, user=request.user)
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(patient=patient)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FeedbackListAPIView(APIView):
    """Admin/receptionist view all feedback."""
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def get(self, request):
        feedbacks = Feedback.objects.select_related('patient__user', 'doctor__user').order_by('-created_at')
        doctor_id = request.query_params.get('doctor')
        if doctor_id:
            feedbacks = feedbacks.filter(doctor_id=doctor_id)
        return Response(FeedbackSerializer(feedbacks, many=True).data)


# ── Support Tickets ───────────────────────────────────────────────────────────

class SupportTicketCreateAPIView(APIView):
    """Patients create support tickets."""
    permission_classes = [IsAuthenticated, IsPatient]

    def post(self, request):
        patient = get_object_or_404(Patient, user=request.user)
        serializer = SupportTicketSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(patient=patient)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """Patient views their own tickets."""
        patient = get_object_or_404(Patient, user=request.user)
        tickets = SupportTicket.objects.filter(patient=patient).order_by('-created_at')
        return Response(SupportTicketSerializer(tickets, many=True).data)


class SupportTicketAdminAPIView(APIView):
    """Admin views and updates all support tickets."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        tickets = SupportTicket.objects.select_related('patient__user').order_by('-created_at')
        ticket_status = request.query_params.get('status')
        if ticket_status:
            tickets = tickets.filter(status=ticket_status)
        return Response(SupportTicketSerializer(tickets, many=True).data)


class SupportTicketStatusUpdateAPIView(APIView):
    """Admin updates ticket status."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        ticket = get_object_or_404(SupportTicket, pk=pk)
        serializer = SupportTicketStatusSerializer(ticket, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"id": ticket.id, "status": ticket.status})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Admissions ────────────────────────────────────────────────────────────────

class AdmissionCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def post(self, request):
        serializer = AdmissionSerializer(data=request.data)
        if serializer.is_valid():
            admission = serializer.save()
            log_action(actor=request.user, role=request.user.role, action='create', instance=admission, request=request)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdmissionListAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def get(self, request):
        admissions = Admission.objects.select_related('patient__user').order_by('-admitted_on')
        # Filter active admissions only
        active_only = request.query_params.get('active')
        if active_only and active_only.lower() == 'true':
            admissions = admissions.filter(discharged_on__isnull=True)
        return Response(AdmissionSerializer(admissions, many=True).data)


class AdmissionDischargeAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def post(self, request, pk):
        admission = get_object_or_404(Admission, pk=pk)
        if admission.discharged_on:
            return Response(
                {"error": "Patient already discharged."},
                status=status.HTTP_400_BAD_REQUEST
            )
        admission.discharged_on = now()
        admission.save(update_fields=['discharged_on'])
        log_action(actor=request.user, role=request.user.role, action='update', instance=admission, request=request)
        return Response({"id": admission.id, "discharged_on": admission.discharged_on})