from rest_framework import serializers
from .models import Department, Designation, Shift, HospitalSettings, NotificationTemplate, ActivityLog
# FIX: Removed unused 'from receptionist.models import Receptionist' import


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = '__all__'


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = '__all__'


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HospitalSettings
        fields = '__all__'


class NotificationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationTemplate
        fields = '__all__'


class ActivityLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = ActivityLog
        fields = ['id', 'username', 'action', 'timestamp']
        read_only_fields = ['timestamp']


class ReceptionistCreateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    shift = serializers.ChoiceField(
        choices=[('Morning', 'Morning'), ('Evening', 'Evening'), ('Night', 'Night')],
        default='Morning',
        required=False
    )


class DoctorCreateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    specialization = serializers.CharField(max_length=200, required=False, default='')
    license_no = serializers.CharField(max_length=100)
    qualification = serializers.CharField(max_length=200, required=False, default='')
    years_of_experience = serializers.IntegerField(default=0, min_value=0)
    department_id = serializers.IntegerField(required=False, allow_null=True)
