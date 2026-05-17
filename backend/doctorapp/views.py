from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.utils.dateparse import parse_date
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import Count, Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from receptionist.models import CheckIn
from patients.models import Patient
from appointments.models import Appointment

from .models import Doctor, Prescription
from .serializers import (
    DoctorUpdateSerializer,
    PrescriptionSerializer
)
from .permissions import IsDoctor

from core.utils import log_action


# ──────────────────────────────────────────────────────────────────────────────
# Shared Helpers
# ──────────────────────────────────────────────────────────────────────────────

def get_doctor(request):
    return get_object_or_404(
        Doctor.objects.select_related(
            "user",
            "department"
        ),
        user=request.user
    )


def doctor_profile_data(doctor):
    return {
        "id": doctor.id,

        "username":
            doctor.user.username,

        "full_name":
            doctor.user.get_full_name()
            or doctor.user.username,

        "email":
            doctor.user.email,

        "department":
            doctor.department.name
            if doctor.department else None,

        "specialization":
            doctor.specialization or "",

        "license_no":
            doctor.license_no or "",

        "qualification":
            doctor.qualification or "",

        "years_of_experience":
            doctor.years_of_experience or 0,

        "image":
            doctor.image.url
            if doctor.image else None,

        "is_active":
            doctor.is_active,
    }


# ──────────────────────────────────────────────────────────────────────────────
# Doctor Profile
# ──────────────────────────────────────────────────────────────────────────────

class DoctorProfileAPIView(APIView):

    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):

        doctor = get_doctor(request)

        return Response({
            "profile": doctor_profile_data(doctor)
        })

    def put(self, request):

        doctor = get_doctor(request)

        serializer = DoctorUpdateSerializer(
            doctor,
            data=request.data,
            partial=True
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()

        log_action(
            actor=request.user,
            role="doctor",
            action="update",
            instance=doctor,
            request=request
        )

        return Response({
            "message": "Profile updated successfully.",
            "profile": doctor_profile_data(doctor)
        })


# ──────────────────────────────────────────────────────────────────────────────
# Change Password
# ──────────────────────────────────────────────────────────────────────────────

class DoctorChangePasswordAPIView(APIView):

    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request):

        user = request.user

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:

            return Response(
                {
                    "error":
                        "Both old_password and new_password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(old_password):

            return Response(
                {
                    "old_password":
                        "Incorrect password."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            validate_password(new_password, user)

        except DjangoValidationError as e:

            return Response(
                {
                    "new_password": list(e.messages)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)

        user.save()

        log_action(
            actor=request.user,
            role="doctor",
            action="update",
            instance=user,
            request=request
        )

        return Response({
            "message": "Password changed successfully."
        })


# ──────────────────────────────────────────────────────────────────────────────
# Doctor Dashboard
# ──────────────────────────────────────────────────────────────────────────────

class DoctorDashboardAPIView(APIView):

    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):

        doctor = get_doctor(request)

        today = now().date()

        # =========================================
        # Today's Appointments
        # =========================================

        today_appointments = (
            Appointment.objects
            .filter(
                doctor=doctor,
                appointment_date=today
            )
            .select_related(
                "patient__user"
            )
            .order_by("appointment_time")
        )

        # =========================================
        # Aggregated Stats
        # =========================================

        stats = today_appointments.aggregate(

            total=Count("id"),

            completed=Count(
                "id",
                filter=Q(
                    status=Appointment.STATUS_COMPLETED
                )
            ),

            pending=Count(
                "id",
                filter=~Q(
                    status=Appointment.STATUS_COMPLETED
                )
            ),
        )

        checked_in_count = (
            CheckIn.objects
            .filter(
                appointment__doctor=doctor,
                appointment__appointment_date=today
            )
            .count()
        )

        total_prescriptions = (
            Prescription.objects
            .filter(doctor=doctor)
            .count()
        )

        unique_patients = (
            Appointment.objects
            .filter(doctor=doctor)
            .values("patient")
            .distinct()
            .count()
        )

        total_appointments = (
            Appointment.objects
            .filter(doctor=doctor)
            .count()
        )

        # =========================================
        # Appointment List
        # =========================================

        appointment_list = [

            {
                "id":
                    appointment.id,

                "patient_name":
                    appointment.patient.user.get_full_name()
                    or appointment.patient.user.username,

                "patient_id":
                    appointment.patient.patient_id,

                "time":
                    appointment.appointment_time.strftime("%I:%M %p")
                    if appointment.appointment_time else None,

                "status":
                    appointment.status,

                "token":
                    appointment.token_number,

                "reason":
                    appointment.reason,
            }

            for appointment in today_appointments
        ]

        # =========================================
        # Response
        # =========================================

        return Response({

            "doctor": {

                "id":
                    doctor.id,

                "name":
                    doctor.user.get_full_name()
                    or doctor.user.username,

                "department":
                    doctor.department.name
                    if doctor.department else None,

                "specialization":
                    doctor.specialization or "",

                "email":
                    doctor.user.email,
            },

            "stats": {

                "today_appointments":
                    stats["total"],

                "today_completed":
                    stats["completed"],

                "today_pending":
                    stats["pending"],

                "checked_in":
                    checked_in_count,

                "total_appointments":
                    total_appointments,

                "total_prescriptions":
                    total_prescriptions,

                "unique_patients":
                    unique_patients,
            },

            "today_list":
                appointment_list,
        })


# ──────────────────────────────────────────────────────────────────────────────
# Appointments By Date
# ──────────────────────────────────────────────────────────────────────────────

class DoctorAppointmentsByDateAPIView(APIView):

    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):

        doctor = get_doctor(request)

        date_param = request.query_params.get("date")

        try:

            selected_date = (
                parse_date(date_param)
                if date_param else now().date()
            )

            if not selected_date:
                raise ValueError

        except (ValueError, TypeError):

            return Response(
                {
                    "error":
                        "Invalid date format. Use YYYY-MM-DD."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        appointments = (
            Appointment.objects
            .filter(
                doctor=doctor,
                appointment_date=selected_date
            )
            .select_related(
                "patient__user"
            )
            .order_by("appointment_time")
        )

        patient_ids_with_prescriptions = set(

            Prescription.objects
            .filter(
                doctor=doctor,
                patient__in=[
                    a.patient
                    for a in appointments
                    if a.patient
                ]
            )
            .values_list(
                "patient_id",
                flat=True
            )
        )

        results = [

            {
                "id":
                    appointment.id,

                "appointment_time":
                    appointment.appointment_time,

                "patient_pk":
                    appointment.patient.id
                    if appointment.patient else None,

                "patient_name":
                    appointment.patient.user.get_full_name()
                    or appointment.patient.user.username
                    if appointment.patient else "",

                "patient_code":
                    appointment.patient.patient_id
                    if appointment.patient else "",

                "token_number":
                    appointment.token_number,

                "reason":
                    appointment.reason,

                "status":
                    appointment.status,

                "has_prescription":
                    (
                        appointment.patient_id
                        in patient_ids_with_prescriptions
                    )
                    if appointment.patient else False,
            }

            for appointment in appointments
        ]

        return Response({

            "date":
                str(selected_date),

            "count":
                len(results),

            "results":
                results,
        })


# ──────────────────────────────────────────────────────────────────────────────
# Complete Appointment
# ──────────────────────────────────────────────────────────────────────────────

class DoctorCompleteAppointmentAPIView(APIView):

    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request, pk):

        doctor = get_doctor(request)

        appointment = get_object_or_404(
            Appointment,
            pk=pk,
            doctor=doctor
        )

        if appointment.status == Appointment.STATUS_COMPLETED:

            return Response(
                {
                    "error":
                        "Appointment already completed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = Appointment.STATUS_COMPLETED

        appointment.save(update_fields=["status"])

        log_action(
            actor=request.user,
            role="doctor",
            action="update",
            instance=appointment,
            request=request
        )

        return Response({

            "message":
                "Appointment completed successfully.",

            "appointment": {

                "id":
                    appointment.id,

                "status":
                    appointment.status,
            }
        })


# ──────────────────────────────────────────────────────────────────────────────
# Past Appointments
# ──────────────────────────────────────────────────────────────────────────────

class DoctorPastAppointmentsAPIView(APIView):

    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):

        doctor = get_doctor(request)

        appointments = (
            Appointment.objects
            .filter(
                doctor=doctor,
                status=Appointment.STATUS_COMPLETED
            )
            .select_related(
                "patient__user"
            )
            .order_by("-appointment_date")
        )

        return Response({

            "count":
                appointments.count(),

            "results": [

                {
                    "id":
                        appointment.id,

                    "date":
                        appointment.appointment_date,

                    "time":
                        appointment.appointment_time,

                    "patient_pk":
                        appointment.patient.id
                        if appointment.patient else None,

                    "patient_name":
                        appointment.patient.user.get_full_name()
                        or appointment.patient.user.username
                        if appointment.patient else "",

                    "token":
                        appointment.token_number,

                    "reason":
                        appointment.reason,
                }

                for appointment in appointments
            ]
        })


# ──────────────────────────────────────────────────────────────────────────────
# Doctor Patient Profile
# ──────────────────────────────────────────────────────────────────────────────

class DoctorPatientProfileAPIView(APIView):

    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request, pk):

        doctor = get_doctor(request)

        patient = get_object_or_404(
            Patient.objects.select_related("user"),
            id=pk
        )

        has_access = Appointment.objects.filter(
            doctor=doctor,
            patient=patient
        ).exists()

        if not has_access:

            return Response(
                {
                    "error":
                        "You do not have access to this patient."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        appointments = (
            Appointment.objects
            .filter(
                doctor=doctor,
                patient=patient
            )
            .order_by("-appointment_date")
        )

        prescriptions = (
            Prescription.objects
            .filter(
                doctor=doctor,
                patient=patient
            )
            .order_by("-date")
        )

        return Response({

            "patient": {

                "id":
                    patient.id,

                "patient_id":
                    patient.patient_id,

                "name":
                    patient.user.get_full_name()
                    or patient.user.username,

                "email":
                    patient.user.email,
            },

            "appointments": [

                {
                    "id":
                        appointment.id,

                    "date":
                        appointment.appointment_date,

                    "time":
                        appointment.appointment_time,

                    "reason":
                        appointment.reason,

                    "status":
                        appointment.status,

                    "token":
                        appointment.token_number,
                }

                for appointment in appointments
            ],

            "prescriptions":
                PrescriptionSerializer(
                    prescriptions,
                    many=True
                ).data,
        })


# ──────────────────────────────────────────────────────────────────────────────
# Prescription List & Create
# ──────────────────────────────────────────────────────────────────────────────

class PrescriptionListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):

        doctor = get_doctor(request)

        prescriptions = (
            Prescription.objects
            .filter(doctor=doctor)
            .select_related(
                "patient__user"
            )
            .order_by("-date")
        )

        return Response(
            PrescriptionSerializer(
                prescriptions,
                many=True
            ).data
        )

    def post(self, request):

        doctor = get_doctor(request)

        patient_id = request.data.get("patient")

        if not patient_id:

            return Response(
                {
                    "patient":
                        "This field is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        patient = get_object_or_404(
            Patient,
            id=patient_id
        )

        has_access = Appointment.objects.filter(
            doctor=doctor,
            patient=patient
        ).exists()

        if not has_access:

            return Response(
                {
                    "error":
                        "You can only prescribe to your own patients."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()

        data.pop("doctor", None)

        serializer = PrescriptionSerializer(data=data)

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        prescription = serializer.save(
            doctor=doctor
        )

        log_action(
            actor=request.user,
            role="doctor",
            action="create",
            instance=prescription,
            request=request
        )

        return Response(
            PrescriptionSerializer(
                prescription
            ).data,
            status=status.HTTP_201_CREATED
        )


# ──────────────────────────────────────────────────────────────────────────────
# Prescription Detail
# ──────────────────────────────────────────────────────────────────────────────

class PrescriptionDetailAPIView(APIView):

    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request, pk):

        doctor = get_doctor(request)

        prescription = get_object_or_404(
            Prescription,
            pk=pk,
            doctor=doctor
        )

        return Response(
            PrescriptionSerializer(
                prescription
            ).data
        )

    def patch(self, request, pk):

        doctor = get_doctor(request)

        prescription = get_object_or_404(
            Prescription,
            pk=pk,
            doctor=doctor
        )

        serializer = PrescriptionSerializer(
            prescription,
            data=request.data,
            partial=True
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()

        log_action(
            actor=request.user,
            role="doctor",
            action="update",
            instance=prescription,
            request=request
        )

        return Response(serializer.data)

    def delete(self, request, pk):

        doctor = get_doctor(request)

        prescription = get_object_or_404(
            Prescription,
            pk=pk,
            doctor=doctor
        )

        log_action(
            actor=request.user,
            role="doctor",
            action="delete",
            instance=prescription,
            request=request
        )

        prescription.delete()

        return Response(
            {
                "message":
                    "Prescription deleted successfully."
            },
            status=status.HTTP_204_NO_CONTENT
        )