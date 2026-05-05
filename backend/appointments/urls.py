from django.urls import path
from .views import (
    AppointmentListCreateAPIView,
    AppointmentDetailAPIView,
    AppointmentStatusUpdateAPIView,
    TodayAppointmentListAPIView,
    DoctorAppointmentListAPIView,
    AppointmentCancelAPIView,
)

app_name = 'appointments'

urlpatterns = [
    # List, create, filter
    path('', AppointmentListCreateAPIView.as_view(), name='list-create'),

    # Today's appointments
    path('today/', TodayAppointmentListAPIView.as_view(), name='today'),

    # Doctor's own schedule
    path('my-schedule/', DoctorAppointmentListAPIView.as_view(), name='doctor-schedule'),

    # Detail, update, delete
    path('<int:pk>/', AppointmentDetailAPIView.as_view(), name='detail'),
    path('<int:pk>/status/', AppointmentStatusUpdateAPIView.as_view(), name='status-update'),
    path('<int:pk>/cancel/', AppointmentCancelAPIView.as_view(), name='cancel'),
]