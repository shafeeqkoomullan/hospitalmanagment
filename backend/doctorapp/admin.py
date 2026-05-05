from django.contrib import admin
from .models import Doctor, Prescription


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['user', 'department', 'specialization', 'license_no', 'years_of_experience', 'is_active']
    list_filter = ['department', 'is_active']
    search_fields = ['user__username', 'user__email', 'license_no', 'specialization']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'doctor', 'patient', 'date']
    list_filter = ['date']
    search_fields = ['doctor__user__username', 'patient__user__username', 'diagnosis']
    readonly_fields = ['date', 'created_at', 'updated_at']