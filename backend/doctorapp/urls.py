from django.urls import path
from .views import (
    DoctorProfileAPIView,
    DoctorChangePasswordAPIView,
    DoctorDashboardAPIView,
    DoctorAppointmentsByDateAPIView,
    DoctorCompleteAppointmentAPIView,
    DoctorPastAppointmentsAPIView,
    DoctorPatientProfileAPIView,
    PrescriptionListCreateAPIView,
    PrescriptionDetailAPIView,
)

app_name = 'doctorapp'

urlpatterns = [
    # Profile
    path('profile/',                                DoctorProfileAPIView.as_view(),              name='profile'),
    path('change-password/',                        DoctorChangePasswordAPIView.as_view(),       name='change-password'),

    # Dashboard
    path('dashboard/',                              DoctorDashboardAPIView.as_view(),            name='dashboard'),

    # Appointments
    path('appointments/by-date/',                   DoctorAppointmentsByDateAPIView.as_view(),   name='appointments-by-date'),
    path('appointments/past/',                      DoctorPastAppointmentsAPIView.as_view(),     name='past-appointments'),
    path('appointments/<int:pk>/complete/',         DoctorCompleteAppointmentAPIView.as_view(),  name='complete-appointment'),

    # Patients
    path('patients/<int:pk>/',                      DoctorPatientProfileAPIView.as_view(),       name='patient-profile'),

    # Prescriptions
    path('prescriptions/',                          PrescriptionListCreateAPIView.as_view(),     name='prescription-list'),
    path('prescriptions/<int:pk>/',                 PrescriptionDetailAPIView.as_view(),         name='prescription-detail'),
]