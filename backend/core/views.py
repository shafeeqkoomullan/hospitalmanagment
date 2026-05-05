from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdmin
from .models import ActionLog
from .serializers import ActionLogSerializer


class ActionLogListAPIView(APIView):
    """Admin-only view to browse all action logs."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        logs = ActionLog.objects.select_related('user').order_by('-created_at')

        # Filters
        role = request.query_params.get('role')
        action = request.query_params.get('action')
        model_name = request.query_params.get('model')
        user_id = request.query_params.get('user')

        if role:
            logs = logs.filter(role=role)
        if action:
            logs = logs.filter(action=action)
        if model_name:
            logs = logs.filter(model_name__icontains=model_name)
        if user_id:
            logs = logs.filter(user_id=user_id)

        # Limit to last 200 for performance
        logs = logs[:200]

        return Response(ActionLogSerializer(logs, many=True).data)