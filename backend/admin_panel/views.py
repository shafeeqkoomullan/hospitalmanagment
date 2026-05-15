from datetime import datetime
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from accounts.models import CustomUser
from receptionist.models import Receptionist
from doctorapp.models import Doctor
from patients.models import Patient
from appointments.models import Appointment

from .permission import IsHospitalAdmin
from .models import Department, Designation, Shift, ActivityLog
from .serializers import (
    DepartmentSerializer,
    DesignationSerializer,
    ShiftSerializer,
    ActivityLogSerializer,
    ReceptionistCreateSerializer,
    DoctorCreateSerializer,
)

RECEPTIONIST_ROLE = 'receptionist'
DOCTOR_ROLE = 'doctor'


# ── Departments ───────────────────────────────────────────────────────────────

class DepartmentListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHospitalAdmin]

    def get(self, request):
        return Response(DepartmentSerializer(Department.objects.all(), many=True).data)

    def post(self, request):
        serializer = DepartmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DepartmentDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHospitalAdmin]

    def put(self, request, pk):
        department = get_object_or_404(Department, pk=pk)
        serializer = DepartmentSerializer(department, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        get_object_or_404(Department, pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── Designations ──────────────────────────────────────────────────────────────

class DesignationListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHospitalAdmin]

    def get(self, request):
        return Response(DesignationSerializer(Designation.objects.all(), many=True).data)

    def post(self, request):
        serializer = DesignationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DesignationDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHospitalAdmin]

    def put(self, request, pk):
        designation = get_object_or_404(Designation, pk=pk)
        serializer = DesignationSerializer(designation, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        get_object_or_404(Designation, pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── Shifts ────────────────────────────────────────────────────────────────────

class ShiftListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHospitalAdmin]

    def get(self, request):
        return Response(ShiftSerializer(Shift.objects.all(), many=True).data)

    def post(self, request):
        serializer = ShiftSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ── Create Staff ──────────────────────────────────────────────────────────────

class AdminCreateReceptionistAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHospitalAdmin]

    @transaction.atomic
    def post(self, request):
        serializer = ReceptionistCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if CustomUser.objects.filter(username=data['username']).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=data['email']).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create_user(
            username=data['username'],
            password=data['password'],
            email=data['email'],
            role=RECEPTIONIST_ROLE,
        )

        receptionist = Receptionist.objects.create(
            user=user,
            shift=data.get('shift', 'Morning'),
        )

        return Response({
            "message": "Receptionist created successfully.",
            "employee_id": receptionist.employee_id,
        }, status=status.HTTP_201_CREATED)


class AdminCreateDoctorAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHospitalAdmin]

    @transaction.atomic
    def post(self, request):
        serializer = DoctorCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if CustomUser.objects.filter(username=data['username']).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=data['email']).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        if Doctor.objects.filter(license_no=data['license_no']).exists():
            return Response({"error": "License number already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create_user(
            username=data['username'],
            password=data['password'],
            email=data['email'],
            role=DOCTOR_ROLE,
        )

        department = None
        if data.get('department_id'):
            department = get_object_or_404(Department, id=data['department_id'])

        doctor = Doctor.objects.create(
            user=user,
            specialization=data.get('specialization', ''),
            license_no=data['license_no'],
            qualification=data.get('qualification', ''),
            years_of_experience=data.get('years_of_experience', 0),
            department=department,
        )

        return Response({
            "message": "Doctor created successfully.",
            "doctor_id": doctor.id,
            "department": department.name if department else None,
        }, status=status.HTTP_201_CREATED)


# ── Dashboard ─────────────────────────────────────────────────────────────────

class AdminDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHospitalAdmin]

    def get(self, request):
        
        print("VIEW USER:", request.user)
        print("VIEW ROLE:", getattr(request.user, "role", None))
        print("VIEW AUTH:", request.user.is_authenticated)

        date_param = request.query_params.get('date')

        if date_param:
            try:
                selected_date = datetime.strptime(date_param, "%Y-%m-%d").date()
            except ValueError:
                return Response(
                    {"error": "Invalid date format. Use YYYY-MM-DD."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            selected_date = now().date()

        appointments = (
            Appointment.objects
            .filter(appointment_date=selected_date)
            .select_related("patient__user", "doctor__user")
        )

        recent_logs = (
            ActivityLog.objects
            .select_related("user")
            .order_by("-timestamp")[:5]
            .values("user__username", "action", "timestamp")
        )

        return Response({
            "date": str(selected_date),
            "totals": {
                "departments": Department.objects.count(),
                "designations": Designation.objects.count(),
                "doctors": Doctor.objects.count(),
                "patients": Patient.objects.count(),
                "receptionists": Receptionist.objects.count(),
                "appointments": Appointment.objects.count(),
            },
            "today_appointments_count": appointments.count(),
            "appointments": [
                {
                    "id": a.id,
                    "patient": a.patient.user.username if a.patient else "",
                    "doctor": a.doctor.user.username if a.doctor else "",
                    "date": a.appointment_date,
                    "time": a.appointment_time,
                    "status": a.status,
                    "token": a.token_number,
                }
                for a in appointments
            ],
            "recent_activity": list(recent_logs),
        })


# ── User Management ───────────────────────────────────────────────────────────

class AdminToggleUserAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHospitalAdmin]

    def post(self, request, user_id):
        user = get_object_or_404(CustomUser, id=user_id)
        user.is_active = not user.is_active
        user.save(update_fields=['is_active'])
        return Response({"id": user.id, "is_active": user.is_active})


class AdminDeleteUserAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHospitalAdmin]

    def delete(self, request, user_id):
        user = get_object_or_404(CustomUser, id=user_id)
        # Soft delete — deactivate instead of destroy
        user.is_active = False
        user.save(update_fields=['is_active'])
        return Response({"message": "User deactivated successfully."})


# ── Doctors ───────────────────────────────────────────────────────────────────

class AdminDoctorListAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHospitalAdmin]

    def get(self, request):
        doctors = Doctor.objects.select_related("user", "department").all()
        return Response([
            {
                "id": d.id,
                "user_id": d.user.id,
                "username": d.user.username,
                "email": d.user.email,
                "specialization": d.specialization,
                "license_no": d.license_no,
                "qualification": d.qualification,
                "years_of_experience": d.years_of_experience,
                "department": d.department.name if d.department else None,
                "is_active": d.user.is_active,
            }
            for d in doctors
        ])


class AdminDoctorUpdateDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHospitalAdmin]

    def put(self, request, id):
        doctor = get_object_or_404(Doctor, id=id)
        data = request.data

        doctor.specialization = data.get("specialization", doctor.specialization)
        doctor.qualification = data.get("qualification", doctor.qualification)
        doctor.years_of_experience = data.get("years_of_experience", doctor.years_of_experience)
        doctor.license_no = data.get("license_no", doctor.license_no)

        if data.get("department_id"):
            doctor.department = get_object_or_404(Department, id=data["department_id"])

        doctor.save()
        return Response({"message": "Doctor updated successfully.", "id": doctor.id})

    def delete(self, request, id):
        doctor = get_object_or_404(Doctor, id=id)
        doctor.user.is_active = False
        doctor.user.save(update_fields=['is_active'])
        return Response({"message": "Doctor deactivated successfully."})


# ── Appointments ──────────────────────────────────────────────────────────────

class AdminAppointmentListAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHospitalAdmin]

    def get(self, request):
        appointments = Appointment.objects.select_related("patient__user", "doctor__user")

        date = request.query_params.get("date")
        if date:
            appointments = appointments.filter(appointment_date=date)

        status_param = request.query_params.get("status")
        if status_param:
            appointments = appointments.filter(status=status_param)

        return Response([
            {
                "id": a.id,
                "patient": a.patient.user.username if a.patient else "",
                "doctor": a.doctor.user.username if a.doctor else "",
                "status": a.status,
                "date": a.appointment_date,
                "time": a.appointment_time,
                "token": a.token_number,
            }
            for a in appointments
        ])


# ── Patients ──────────────────────────────────────────────────────────────────

class AdminPatientListAPIView(APIView):
    permission_classes = [IsAuthenticated, IsHospitalAdmin]

    def get(self, request):
        patients = Patient.objects.select_related("user").all()
        return Response([
            {
                "id": p.id,
                "user_id": p.user.id,
                "username": p.user.username,
                "email": p.user.email,
                "is_active": p.user.is_active,
            }
            for p in patients
        ])