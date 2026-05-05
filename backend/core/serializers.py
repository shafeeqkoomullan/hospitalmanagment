from rest_framework import serializers
from .models import ActionLog


class ActionLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = ActionLog
        fields = [
            'id', 'username', 'role', 'action',
            'model_name', 'object_id', 'description',
            'ip_address', 'created_at'
        ]
        read_only_fields = fields