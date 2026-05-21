from django.utils import timezone
from django.utils.dateparse import parse_date
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db import transaction
from collections import defaultdict

import secrets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from appointments.models import Appointment
from appointments.serializers import AppointmentSerializer

from patients.models import Patient, MedicalRecord
from patients.serializers import (
    PatientSerializer,
    PatientUpdateSerializer,
    MedicalRecordSerializer
)

from doctorapp.models import Doctor
from doctorapp.serializers import DoctorSerializer

from admin_panel.models import Department
from admin_panel.serializers import DepartmentSerializer

from .models import CheckIn, WalkIn, VisitorLog, Receptionist, Token
from .serializers import (
    CheckInSerializer,
    WalkInSerializer,
    VisitorLogSerializer,
    TokenSerializer,
)
from .permissions import IsReceptionist
from .utils import generate_next_token   # ✅ CORRECT

User = get_user_model()


# ── Dashboard ─────────────────────────────────────────


class ReceptionistDashboardAPIView(APIView):

    permission_classes = [IsAuthenticated, IsReceptionist]

    def get(self, request):

        today = timezone.now().date()

        # ============================================
        # Base Appointment Query
        # ============================================

        today_appointments = (
            Appointment.objects
            .filter(appointment_date=today)
            .select_related(
                "patient__user",
                "doctor__user",
            )
        )

        # ============================================
        # Dashboard Stats
        # ============================================

        total_appointments = today_appointments.count()

        checked_in = (
            CheckIn.objects.filter(
                appointment__appointment_date=today
            ).count()
        )

        walkins = (
            WalkIn.objects.filter(
                registered_at__date=today
            ).count()
        )

        visitors = (
            VisitorLog.objects.filter(
                check_in_time__date=today
            ).count()
        )

        # ============================================
        # Queue Appointments
        # ============================================

        queue_appointments = (
            today_appointments
            .filter(
                status__in=[
                    "Scheduled",
                    "Checked In",
                ]
            )
            .order_by(
                "doctor",
                "appointment_time",
            )
        )

        # ============================================
        # Completed Consultations
        # ============================================

        completed_appointments = (
            today_appointments
            .filter(status="Completed")
            .prefetch_related('bills')
            .order_by("-appointment_time")
        )

        # ============================================
        # Doctor-Based Queue
        # ============================================

        doctor_queues = defaultdict(list)

        for ap in queue_appointments:

            doctor_name = (
                ap.doctor.user.get_full_name()
                or ap.doctor.user.username
            ) if ap.doctor else "Unknown Doctor"

            patient_name = (
                ap.patient.user.get_full_name()
                or ap.patient.user.username
            ) if ap.patient else "—"

            doctor_queues[doctor_name].append({

                "id": ap.id,

                "patient_name": patient_name,

                "time": (
                    ap.appointment_time.strftime("%I:%M %p")
                    if ap.appointment_time
                    else "—"
                ),

                "status": ap.status,

                "token": ap.token_number or "—",

            })

        # ============================================
        # Completed Consultation Data
        # ============================================

        completed_data = []

        for ap in completed_appointments:

            completed_data.append({

                "id": ap.id,

                "patient_name": (
                    ap.patient.user.get_full_name()
                    or ap.patient.user.username
                ) if ap.patient else "—",

                "doctor_name": (
                    ap.doctor.user.get_full_name()
                    or ap.doctor.user.username
                ) if ap.doctor else "—",

                "time": (
                    ap.appointment_time.strftime("%I:%M %p")
                    if ap.appointment_time
                    else "—"
                ),

                "status": ap.status,

                "token": ap.token_number or "—",

                "has_bill": (
                    hasattr(ap, "bills")
                    and ap.bills.exists()
                ),

            })

        # ============================================
        # Final Response
        # ============================================

        return Response({

            "total_appointments":
                total_appointments,

            "checked_in":
                checked_in,

            "walkins":
                walkins,

            "visitors":
                visitors,

            "doctor_queues":
                doctor_queues,

            "completed_consultations":
                completed_data,

        })

class PatientRegisterAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    @transaction.atomic
    def post(self, request):

        full_name = request.data.get("full_name", "").strip()
        phone = request.data.get("phone", "").strip()
        email = request.data.get("email", "").strip()

        if not full_name:
            return Response(
                {"full_name": "Patient name is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not phone:
            return Response(
                {"phone": "Phone number is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent duplicate patient
        if User.objects.filter(username=phone).exists():
            return Response(
                {"phone": "Patient already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Split first & last name
        parts = full_name.split(" ", 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ""

        # Generate secure random password
        random_password = secrets.token_urlsafe(12)

        try:
            # Create user
            user = User.objects.create_user(
                username=phone,
                password=random_password,
                first_name=first_name,
                last_name=last_name,
                email=email,
                role="patient",
            )

            # Patient profile data
            patient_data = {
                "user": user.id,
                "phone": phone,
                "gender": request.data.get("gender", "other"),
                "address": request.data.get("address", ""),
                "age": request.data.get("age"),
                "blood_group": request.data.get("blood_group", ""),
                "emergency_contact": request.data.get("emergency_contact", ""),
            }

            serializer = PatientSerializer(data=patient_data)

            if serializer.is_valid():
                serializer.save()

                return Response(
                    {
                        "message": "Patient registered successfully",
                        "patient": serializer.data,
                        "generated_password": random_password,
                    },
                    status=status.HTTP_201_CREATED
                )

            # rollback user if serializer fails
            user.delete()

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            import traceback
            traceback.print_exc()

            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PatientListAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    def get(self, request):
        patients = Patient.objects.select_related('user').order_by('-created_at')
        return Response(PatientSerializer(patients, many=True).data)


class PatientDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    def get(self, request, patient_id):
        patient = get_object_or_404(Patient.objects.select_related('user'), id=patient_id)
        return Response(PatientSerializer(patient).data)


class PatientUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    def patch(self, request, patient_id):
        patient = get_object_or_404(Patient, id=patient_id)
        serializer = PatientUpdateSerializer(patient, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(PatientSerializer(patient).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PatientBlockToggleAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    def patch(self, request, patient_id):
        patient = get_object_or_404(Patient, id=patient_id)
        patient.is_blocked = not patient.is_blocked
        patient.save(update_fields=['is_blocked'])
        return Response({"id": patient.id, "is_blocked": patient.is_blocked})


class ReceptionistPatientMedicalRecordListAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    def get(self, request, patient_id):
        patient = get_object_or_404(Patient, id=patient_id)

        records = (
            MedicalRecord.objects
            .filter(patient=patient)
            .select_related('doctor__user')
            .order_by('-created_at')
        )

        return Response(MedicalRecordSerializer(records, many=True).data)


# ── Appointments ─────────────────────────────────────

class ReceptionistTodayAppointmentsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    def get(self, request):
        today = timezone.now().date()

        appointments = (
            Appointment.objects
            .filter(appointment_date=today)
            .select_related('patient__user', 'doctor__user')
            .order_by('appointment_time')
        )

        return Response(AppointmentSerializer(appointments, many=True).data)


class ReceptionistAppointmentCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    @transaction.atomic
    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        appointment = serializer.save(created_by=request.user)
        receptionist = get_object_or_404(Receptionist, user=request.user)

        token_num = generate_next_token(
            appointment.doctor,
            appointment.appointment_date
        )

        appointment.token_number = token_num
        appointment.save(update_fields=['token_number'])

        Token.objects.create(
            appointment=appointment,
            token_number=token_num,
            issued_by=receptionist,
        )

        return Response({
            "message": "Appointment created successfully",
            "appointment": AppointmentSerializer(appointment).data,
            "token_number": token_num,
        }, status=status.HTTP_201_CREATED)


# ── Token & Check-In ────────────────────────────────

class GenerateTokenAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    def post(self, request, appointment_id):
        appointment = get_object_or_404(Appointment, id=appointment_id)

        if Token.objects.filter(appointment=appointment).exists():
            return Response({"error": "Token already generated"}, status=status.HTTP_400_BAD_REQUEST)

        receptionist = get_object_or_404(Receptionist, user=request.user)

        token_num = generate_next_token(
            appointment.doctor,
            appointment.appointment_date
        )

        token = Token.objects.create(
            appointment=appointment,
            token_number=token_num,
            issued_by=receptionist,
        )

        appointment.token_number = token_num
        appointment.save(update_fields=['token_number'])

        return Response(TokenSerializer(token).data, status=status.HTTP_201_CREATED)


class CheckInAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    def post(self, request, appointment_id):
        appointment = get_object_or_404(Appointment, id=appointment_id)

        if CheckIn.objects.filter(appointment=appointment).exists():
            return Response({"error": "Already checked in"}, status=status.HTTP_400_BAD_REQUEST)

        receptionist = get_object_or_404(Receptionist, user=request.user)

        checkin = CheckIn.objects.create(
            appointment=appointment,
            receptionist=receptionist
        )

        return Response(CheckInSerializer(checkin).data, status=status.HTTP_201_CREATED)


# ── Walk-in ─────────────────────────────────────────

class WalkInCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    def post(self, request):
        serializer = WalkInSerializer(data=request.data)

        if serializer.is_valid():
            receptionist = get_object_or_404(Receptionist, user=request.user)
            doctor = serializer.validated_data['doctor']

            token_num = generate_next_token(
                doctor,
                timezone.now().date()
            )

            serializer.save(
                receptionist=receptionist,
                token_number=token_num
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Visitors ────────────────────────────────────────

class VisitorLogCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    def post(self, request):
        receptionist = get_object_or_404(Receptionist, user=request.user)
        serializer = VisitorLogSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(receptionist=receptionist)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VisitorCheckoutAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    def post(self, request, visitor_id):
        visit = get_object_or_404(VisitorLog, id=visitor_id)

        if visit.check_out_time:
            return Response({"error": "Already checked out"}, status=status.HTTP_400_BAD_REQUEST)

        visit.check_out_time = timezone.now()
        visit.save(update_fields=['check_out_time'])

        return Response({
            "id": visit.id,
            "check_out_time": visit.check_out_time
        })


# ── Reference Data ──────────────────────────────────

class ReceptionistDepartmentListAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    def get(self, request):
        departments = Department.objects.all().order_by('name')
        return Response(DepartmentSerializer(departments, many=True).data)


class ReceptionistDoctorListAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    def get(self, request):
        doctors = (
            Doctor.objects
            .select_related('user', 'department')
            .filter(is_active=True)
            .order_by('id')
        )

        return Response(DoctorSerializer(doctors, many=True).data)

class ReceptionistAppointmentsByDateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionist]

    def get(self, request):
        date_str = request.query_params.get('date')

        if date_str:
            selected_date = parse_date(date_str)
            if not selected_date:
                return Response(
                    {"error": "Invalid date format (YYYY-MM-DD)"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            selected_date = timezone.now().date()

        appointments = (
            Appointment.objects
            .filter(appointment_date=selected_date)
            .select_related('doctor__user', 'patient__user')
            .order_by('appointment_time')
        )

        return Response({
            "date": str(selected_date),
            "count": appointments.count(),
            "results": AppointmentSerializer(appointments, many=True).data
        })