from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Appointment
from .serializers import AppointmentSerializer, AppointmentStatusUpdateSerializer
from accounts.permissions import IsAdmin, IsReceptionistOrAdmin, IsDoctor


# ── List & Create ─────────────────────────────────────────────────────────────

class AppointmentListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def get(self, request):
        appointments = Appointment.objects.select_related(
            'patient__user', 'doctor__user', 'created_by'
        ).all()

        # Filters
        date = request.query_params.get('date')
        doctor_id = request.query_params.get('doctor')
        patient_id = request.query_params.get('patient')
        appt_status = request.query_params.get('status')

        if date:
            appointments = appointments.filter(appointment_date=date)
        if doctor_id:
            appointments = appointments.filter(doctor_id=doctor_id)
        if patient_id:
            appointments = appointments.filter(patient_id=patient_id)
        if appt_status:
            appointments = appointments.filter(status=appt_status)

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Detail, Update, Delete ────────────────────────────────────────────────────

class AppointmentDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def get(self, request, pk):
        appointment = get_object_or_404(
            Appointment.objects.select_related('patient__user', 'doctor__user', 'created_by'),
            pk=pk
        )
        return Response(AppointmentSerializer(appointment).data)

    def patch(self, request, pk):
        appointment = get_object_or_404(Appointment, pk=pk)
        serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        appointment = get_object_or_404(Appointment, pk=pk)
        appointment.delete()
        # FIX: 204 No Content must not include a body — removed {"message": ...}
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── Status Update ─────────────────────────────────────────────────────────────

class AppointmentStatusUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def patch(self, request, pk):
        appointment = get_object_or_404(Appointment, pk=pk)
        serializer = AppointmentStatusUpdateSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # FIX: Was returning appointment.status (stale pre-save value).
            # serializer.instance holds the refreshed object after save.
            return Response({"id": appointment.id, "status": serializer.instance.status})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Today's Appointments ──────────────────────────────────────────────────────

class TodayAppointmentListAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def get(self, request):
        today = timezone.now().date()
        appointments = (
            Appointment.objects
            .filter(appointment_date=today)
            .select_related('patient__user', 'doctor__user')
            .order_by('appointment_time')
        )
        return Response(AppointmentSerializer(appointments, many=True).data)


# ── Doctor's own appointments ─────────────────────────────────────────────────

class DoctorAppointmentListAPIView(APIView):
    """Doctors can view their own appointment list."""
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        date = request.query_params.get('date')
        appt_status = request.query_params.get('status')

        appointments = (
            Appointment.objects
            .filter(doctor__user=request.user)
            .select_related('patient__user')
            .order_by('appointment_date', 'appointment_time')
        )

        if date:
            appointments = appointments.filter(appointment_date=date)
        if appt_status:
            appointments = appointments.filter(status=appt_status)

        return Response(AppointmentSerializer(appointments, many=True).data)


# ── Cancel ────────────────────────────────────────────────────────────────────

class AppointmentCancelAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def post(self, request, pk):
        appointment = get_object_or_404(Appointment, pk=pk)

        # FIX: Use model constants instead of raw strings
        if appointment.status in [Appointment.STATUS_COMPLETED, Appointment.STATUS_CANCELLED]:
            return Response(
                {"error": f"Cannot cancel an appointment with status '{appointment.status}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = Appointment.STATUS_CANCELLED
        appointment.save(update_fields=['status'])
        return Response({"id": appointment.id, "status": appointment.status})
