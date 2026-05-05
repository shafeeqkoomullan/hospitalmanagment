from rest_framework import serializers
from .models import Receptionist, CheckIn, WalkIn, VisitorLog, Token


class ReceptionistSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Receptionist
        fields = ['id', 'username', 'email', 'full_name', 'employee_id', 'shift']
        read_only_fields = ['id', 'employee_id']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username


class CheckInSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='appointment.patient.__str__', read_only=True)
    receptionist_name = serializers.CharField(source='receptionist.__str__', read_only=True)

    class Meta:
        model = CheckIn
        fields = ['id', 'appointment', 'receptionist', 'receptionist_name', 'patient_name', 'checkin_time']
        read_only_fields = ['id', 'checkin_time', 'receptionist', 'receptionist_name', 'patient_name']


class WalkInSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.__str__', read_only=True)
    doctor_name = serializers.CharField(source='doctor.__str__', read_only=True)

    class Meta:
        model = WalkIn
        fields = ['id', 'patient', 'patient_name', 'doctor', 'doctor_name', 'token_number', 'registered_at']
        read_only_fields = ['id', 'token_number', 'registered_at']


class VisitorLogSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.__str__', read_only=True)
    is_checked_out = serializers.SerializerMethodField()

    class Meta:
        model = VisitorLog
        fields = [
            'id', 'patient', 'patient_name', 'visitor_name',
            'relation', 'check_in_time', 'check_out_time', 'is_checked_out'
        ]
        read_only_fields = ['id', 'check_in_time', 'check_out_time']

    def get_is_checked_out(self, obj):
        return obj.check_out_time is not None


class TokenSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='appointment.patient.__str__', read_only=True)
    doctor_name = serializers.CharField(source='appointment.doctor.__str__', read_only=True)
    appointment_date = serializers.DateField(source='appointment.appointment_date', read_only=True)

    class Meta:
        model = Token
        fields = [
            'id', 'appointment', 'patient_name', 'doctor_name',
            'appointment_date', 'token_number', 'issued_at'
        ]
        read_only_fields = ['id', 'token_number', 'issued_at']