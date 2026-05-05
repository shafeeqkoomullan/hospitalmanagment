from django.contrib import admin
from .models import ActionLog


@admin.register(ActionLog)
class ActionLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'action', 'model_name', 'object_id', 'ip_address', 'created_at']
    list_filter = ['role', 'action', 'model_name']
    search_fields = ['user__username', 'description', 'model_name']
    readonly_fields = ['user', 'role', 'action', 'model_name', 'object_id', 'description', 'ip_address', 'created_at']
    ordering = ['-created_at']

    def has_add_permission(self, request):
        return False  # Logs should never be manually created

    def has_delete_permission(self, request, obj=None):
        return False  # Logs should never be deleted from admin