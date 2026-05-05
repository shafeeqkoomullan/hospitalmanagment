from django.contrib import admin
from .models import Receptionist, CheckIn, WalkIn, VisitorLog, Token


@admin.register(Receptionist)
class ReceptionistAdmin(admin.ModelAdmin):
    list_display = ['user', 'employee_id', 'shift', 'created_at']
    list_filter = ['shift']
    search_fields = ['user__username', 'employee_id']
    readonly_fields = ['employee_id', 'created_at', 'updated_at']


@admin.register(CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    list_display = ['appointment', 'receptionist', 'checkin_time']
    search_fields = ['appointment__patient__user__username']
    readonly_fields = ['checkin_time']


@admin.register(WalkIn)
class WalkInAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'receptionist', 'token_number', 'registered_at']
    search_fields = ['patient__user__username', 'doctor__user__username']
    readonly_fields = ['registered_at']


@admin.register(VisitorLog)
class VisitorLogAdmin(admin.ModelAdmin):
    list_display = ['visitor_name', 'patient', 'relation', 'check_in_time', 'check_out_time']
    search_fields = ['visitor_name', 'patient__user__username']
    readonly_fields = ['check_in_time']


@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    list_display = ['token_number', 'appointment', 'issued_by', 'issued_at']
    search_fields = ['appointment__patient__user__username']
    readonly_fields = ['issued_at']