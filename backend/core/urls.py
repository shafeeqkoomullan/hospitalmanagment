from django.urls import path
from .views import ActionLogListAPIView

app_name = 'core'

urlpatterns = [
    path('logs/', ActionLogListAPIView.as_view(), name='action-logs'),
]