from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'doctor', 'appointment_date', 'appointment_time', 'token_number', 'status']
    list_filter = ['status', 'appointment_date']
    search_fields = ['patient__user__username', 'doctor__user__username']
    ordering = ['-appointment_date', 'appointment_time']
    readonly_fields = ['created_at', 'updated_at', 'created_by']