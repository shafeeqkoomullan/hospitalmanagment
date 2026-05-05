from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from patients.models import Patient
from appointments.models import Appointment

from .models import Doctor, Prescription
from .serializers import DoctorSerializer, DoctorUpdateSerializer, PrescriptionSerializer
from .permissions import IsDoctor

from core.utils import log_action


def _doctor_profile_data(doctor):
    """Shared helper to build doctor profile response dict."""
    return {
        "id": doctor.id,
        "username": doctor.user.username,
        "email": doctor.user.email,
        "department": doctor.department.name if doctor.department else None,
        "specialization": doctor.specialization or "",
        "license_no": doctor.license_no or "",
        "qualification": doctor.qualification or "",
        "years_of_experience": doctor.years_of_experience or 0,
        "image": doctor.image.url if doctor.image else None,
        "is_active": doctor.is_active,
    }


# ── Profile ───────────────────────────────────────────────────────────────────

class DoctorProfileAPIView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        doctor = get_object_or_404(Doctor, user=request.user)
        return Response(_doctor_profile_data(doctor))

    def put(self, request):
        doctor = get_object_or_404(Doctor, user=request.user)
        serializer = DoctorUpdateSerializer(doctor, data=request.data, partial=True)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        log_action(actor=request.user, role='doctor', action='update', instance=doctor, request=request)
        return Response(_doctor_profile_data(doctor))


# ── Change Password ───────────────────────────────────────────────────────────

class DoctorChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request):
        user = request.user
        old = request.data.get('old_password')
        new = request.data.get('new_password')

        if not old or not new:
            return Response(
                {"error": "Both old_password and new_password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(old):
            return Response(
                {"old_password": "Incorrect password."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            validate_password(new, user)
        except DjangoValidationError as e:
            return Response({"new_password": list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new)
        user.save()
        log_action(actor=request.user, role='doctor', action='update', instance=user, request=request)
        return Response({"message": "Password changed successfully."})


# ── Dashboard ─────────────────────────────────────────────────────────────────

class DoctorDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        doctor = get_object_or_404(Doctor, user=request.user)
        today = now().date()

        today_appointments = Appointment.objects.filter(
            doctor=doctor,
            appointment_date=today
        )

        return Response({
            "doctor_name": doctor.user.get_full_name() or doctor.user.username,
            "department": doctor.department.name if doctor.department else None,
            "today_appointments": today_appointments.count(),
            "today_pending": today_appointments.exclude(status='Completed').count(),
            "total_prescriptions": Prescription.objects.filter(doctor=doctor).count(),
            "unique_patients": Appointment.objects.filter(
                doctor=doctor
            ).values('patient').distinct().count(),
        })


# ── Appointments ──────────────────────────────────────────────────────────────

class DoctorAppointmentsByDateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        doctor = get_object_or_404(Doctor, user=request.user)
        date_param = request.query_params.get('date')

        try:
            from django.utils.dateparse import parse_date
            selected_date = parse_date(date_param) if date_param else now().date()
            if not selected_date:
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointments = (
            Appointment.objects
            .filter(doctor=doctor, appointment_date=selected_date)
            .select_related('patient', 'patient__user')
            .order_by('appointment_time')
        )

        # Resolve prescriptions in a single query — no N+1
        patient_ids_with_rx = set(
            Prescription.objects
            .filter(doctor=doctor, patient__in=[a.patient for a in appointments if a.patient])
            .values_list('patient_id', flat=True)
        )

        results = [
            {
                "id": a.id,
                "appointment_time": a.appointment_time,
                "patient_pk": a.patient.id if a.patient else None,
                "patient_name": a.patient.user.username if a.patient else "",
                "patient_code": a.patient.patient_id if a.patient else "",
                "token_number": a.token_number,
                "reason": a.reason,
                "status": a.status,
                "has_prescription": (a.patient_id in patient_ids_with_rx) if a.patient else False,
            }
            for a in appointments
        ]

        return Response({"date": str(selected_date), "count": len(results), "results": results})


class DoctorCompleteAppointmentAPIView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request, pk):
        doctor = get_object_or_404(Doctor, user=request.user)
        appointment = get_object_or_404(Appointment, pk=pk, doctor=doctor)

        if appointment.status == 'Completed':
            return Response(
                {"error": "Appointment is already completed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = 'Completed'  # matches Appointment.STATUS_CHOICES
        appointment.save(update_fields=['status'])
        log_action(actor=request.user, role='doctor', action='update', instance=appointment, request=request)
        return Response({"id": appointment.id, "status": appointment.status})


class DoctorPastAppointmentsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        doctor = get_object_or_404(Doctor, user=request.user)

        appointments = (
            Appointment.objects
            .filter(doctor=doctor, status='Completed')
            .select_related('patient', 'patient__user')
            .order_by('-appointment_date')
        )

        return Response({
            "count": appointments.count(),
            "results": [
                {
                    "id": a.id,
                    "date": a.appointment_date,
                    "time": a.appointment_time,
                    "patient_pk": a.patient.id if a.patient else None,
                    "patient": a.patient.user.username if a.patient else "",
                    "token": a.token_number,
                    "reason": a.reason,
                }
                for a in appointments
            ],
        })


# ── Patient Profile (doctor view) ─────────────────────────────────────────────

class DoctorPatientProfileAPIView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request, pk):
        doctor = get_object_or_404(Doctor, user=request.user)
        patient = get_object_or_404(Patient, id=pk)

        # Only allow if doctor has had at least one appointment with this patient
        if not Appointment.objects.filter(doctor=doctor, patient=patient).exists():
            return Response(
                {"error": "You do not have access to this patient's profile."},
                status=status.HTTP_403_FORBIDDEN
            )

        appointments = (
            Appointment.objects
            .filter(doctor=doctor, patient=patient)
            .order_by('-appointment_date')
        )
        prescriptions = (
            Prescription.objects
            .filter(doctor=doctor, patient=patient)
            .order_by('-date')
        )

        return Response({
            "patient": {
                "id": patient.id,
                "patient_id": patient.patient_id,
                "name": patient.user.get_full_name() or patient.user.username,
                "email": patient.user.email,
            },
            "appointments": [
                {
                    "id": a.id,
                    "date": a.appointment_date,
                    "time": a.appointment_time,
                    "reason": a.reason,
                    "status": a.status,
                    "token": a.token_number,
                }
                for a in appointments
            ],
            "prescriptions": PrescriptionSerializer(prescriptions, many=True).data,
        })


# ── Prescriptions ─────────────────────────────────────────────────────────────

class PrescriptionListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        doctor = get_object_or_404(Doctor, user=request.user)
        prescriptions = (
            Prescription.objects
            .filter(doctor=doctor)
            .select_related('patient', 'patient__user')
            .order_by('-date')
        )
        return Response(PrescriptionSerializer(prescriptions, many=True).data)

    def post(self, request):
        doctor = get_object_or_404(Doctor, user=request.user)

        patient_id = request.data.get('patient')
        if not patient_id:
            return Response({"patient": "This field is required."}, status=status.HTTP_400_BAD_REQUEST)

        patient = get_object_or_404(Patient, id=patient_id)

        # Doctor can only prescribe to their own patients
        if not Appointment.objects.filter(doctor=doctor, patient=patient).exists():
            return Response(
                {"error": "You can only prescribe to patients you have seen."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = PrescriptionSerializer(data=request.data)
        if serializer.is_valid():
            prescription = serializer.save(doctor=doctor)
            log_action(actor=request.user, role='doctor', action='create', instance=prescription, request=request)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PrescriptionDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request, pk):
        doctor = get_object_or_404(Doctor, user=request.user)
        prescription = get_object_or_404(Prescription, pk=pk, doctor=doctor)
        return Response(PrescriptionSerializer(prescription).data)

    def patch(self, request, pk):
        doctor = get_object_or_404(Doctor, user=request.user)
        prescription = get_object_or_404(Prescription, pk=pk, doctor=doctor)
        serializer = PrescriptionSerializer(prescription, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            log_action(actor=request.user, role='doctor', action='update', instance=prescription, request=request)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        doctor = get_object_or_404(Doctor, user=request.user)
        prescription = get_object_or_404(Prescription, pk=pk, doctor=doctor)
        log_action(actor=request.user, role='doctor', action='delete', instance=prescription, request=request)
        prescription.delete()
        return Response({"message": "Prescription deleted."}, status=status.HTTP_204_NO_CONTENT)