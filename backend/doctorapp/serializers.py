from rest_framework import serializers
from .models import Doctor, Prescription


class DoctorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Doctor
        fields = [
            'id', 'username', 'email',
            'department', 'department_name',
            'specialization', 'license_no', 'qualification',
            'years_of_experience', 'image', 'is_active',
        ]
        read_only_fields = ['id', 'license_no']


class DoctorUpdateSerializer(serializers.ModelSerializer):
    """Used for doctor self-update — only editable fields."""
    class Meta:
        model = Doctor
        fields = ['specialization', 'qualification', 'years_of_experience', 'image']


class PrescriptionSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.username', read_only=True)
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = Prescription
        fields = [
            'id', 'doctor', 'doctor_name',
            'patient', 'patient_name',
            'diagnosis', 'medicines', 'notes', 'date',
        ]
        read_only_fields = ['id', 'date', 'doctor']

    def get_patient_name(self, obj):
        if obj.patient and obj.patient.user:
            name = f"{obj.patient.user.first_name} {obj.patient.user.last_name}".strip()
            return name or obj.patient.user.username
        return None