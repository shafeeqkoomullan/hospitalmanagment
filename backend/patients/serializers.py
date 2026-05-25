from rest_framework import serializers
from .models import Patient, MedicalRecord, MedicalReport, Feedback, SupportTicket, Admission
from django.contrib.auth import get_user_model

User = get_user_model()


class PatientSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    username  = serializers.CharField(source='user.username', read_only=True)
    email     = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            'id', 'user', 'patient_id',
            'username', 'email', 'full_name',
            'phone', 'address', 'age', 'gender',
            'blood_group', 'emergency_contact',
            'is_blocked', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'patient_id', 'username',
            'email', 'full_name', 'created_at', 'updated_at',
        ]

    def get_full_name(self, obj):
        name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return name or obj.user.username


class PatientUpdateSerializer(serializers.ModelSerializer):
    """For patient self-update or receptionist update — excludes identity fields."""
    class Meta:
        model = Patient
        fields = ['phone', 'address', 'age', 'gender', 'blood_group', 'emergency_contact']


class MedicalReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalReport
        fields = ['id', 'medical_record', 'title', 'file']
        read_only_fields = ['id']


class MedicalRecordSerializer(serializers.ModelSerializer):
    doctor_name  = serializers.CharField(source='doctor.user.username', read_only=True)
    patient_name = serializers.CharField(source='patient.user.username', read_only=True)
    reports      = MedicalReportSerializer(many=True, read_only=True)

    class Meta:
        model = MedicalRecord
        fields = [
            'id', 'patient', 'patient_name',
            'doctor', 'doctor_name',
            'diagnosis', 'prescription', 'test_results',
            'reports', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FeedbackSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.username', read_only=True)
    doctor_name  = serializers.CharField(source='doctor.user.username', read_only=True)

    class Meta:
        model = Feedback
        fields = [
            'id', 'patient', 'patient_name',
            'doctor', 'doctor_name',
            'rating', 'comment', 'created_at',
        ]
        read_only_fields = ['id', 'patient', 'created_at']

    def validate_rating(self, value):
        # FIX: Kept serializer-level validation even though model now has choices,
        # so API returns a clear error message rather than a generic DB constraint error.
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class SupportTicketSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.username', read_only=True)

    class Meta:
        model = SupportTicket
        fields = [
            'id', 'patient', 'patient_name',
            'subject', 'message', 'status',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'patient', 'created_at', 'updated_at']


class SupportTicketStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = ['status']

    def validate_status(self, value):
        valid = [s[0] for s in SupportTicket.STATUS_CHOICES]
        if value not in valid:
            raise serializers.ValidationError(f"Invalid status. Choose from: {valid}")
        return value


class AdmissionSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.username', read_only=True)
    is_admitted  = serializers.SerializerMethodField()

    class Meta:
        model = Admission
        fields = [
            'id', 'patient', 'patient_name',
            'admitted_on', 'discharged_on',
            'room_number', 'reason', 'is_admitted',
        ]
        read_only_fields = ['id', 'admitted_on']

    def get_is_admitted(self, obj):
        return obj.discharged_on is None
