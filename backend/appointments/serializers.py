from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_name',
            'doctor', 'doctor_name',
            'created_by', 'created_by_username',
            'appointment_date', 'appointment_time',
            'token_number', 'reason', 'status',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'token_number', 'created_by', 'created_at', 'updated_at']

    def get_patient_name(self, obj):
        if obj.patient and obj.patient.user:
            return f"{obj.patient.user.first_name} {obj.patient.user.last_name}".strip() or obj.patient.user.username
        return None

    def get_doctor_name(self, obj):
        if obj.doctor and obj.doctor.user:
            return f"{obj.doctor.user.first_name} {obj.doctor.user.last_name}".strip() or obj.doctor.user.username
        return None

    def validate(self, attrs):
        doctor = attrs.get('doctor')
        appointment_date = attrs.get('appointment_date')
        appointment_time = attrs.get('appointment_time')

        # FIX: Only run double-booking check when all three fields are present.
        # Previously, a None appointment_time would match ALL null-time slots
        # for that doctor+date, causing false conflicts.
        if doctor and appointment_date and appointment_time:
            qs = Appointment.objects.filter(
                doctor=doctor,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                # FIX: Use model constants instead of raw strings
                status__in=[Appointment.STATUS_SCHEDULED, Appointment.STATUS_CHECKED_IN],
            )
            # Exclude current instance on update
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)

            if qs.exists():
                raise serializers.ValidationError(
                    {"appointment_time": "This doctor already has an appointment at this date and time."}
                )

        return attrs


class AppointmentStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['status']

    def validate_status(self, value):
        valid = [s[0] for s in Appointment.STATUS_CHOICES]
        if value not in valid:
            raise serializers.ValidationError(f"Invalid status. Choose from: {valid}")
        return value
