from django.contrib import admin
from .models import Patient, MedicalRecord, MedicalReport, Feedback, SupportTicket, Admission


class MedicalReportInline(admin.TabularInline):
    model = MedicalReport
    extra = 0


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['user', 'patient_id', 'phone', 'age', 'gender', 'blood_group', 'is_blocked']
    list_filter = ['gender', 'blood_group', 'is_blocked']
    search_fields = ['user__username', 'user__email', 'patient_id', 'phone']
    readonly_fields = ['patient_id', 'created_at', 'updated_at']


@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'created_at']
    search_fields = ['patient__user__username', 'doctor__user__username', 'diagnosis']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [MedicalReportInline]


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'rating', 'created_at']
    list_filter = ['rating']
    search_fields = ['patient__user__username', 'doctor__user__username']
    readonly_fields = ['created_at']


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ['patient', 'subject', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['patient__user__username', 'subject']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Admission)
class AdmissionAdmin(admin.ModelAdmin):
    list_display = ['patient', 'room_number', 'admitted_on', 'discharged_on']
    list_filter = ['admitted_on']
    search_fields = ['patient__user__username', 'room_number']
    readonly_fields = ['admitted_on']