from django.urls import path
from .views import (
    ReceptionistDashboardAPIView,
    PatientRegisterAPIView,
    PatientListAPIView,
    PatientDetailAPIView,
    PatientUpdateAPIView,
    PatientBlockToggleAPIView,
    ReceptionistPatientMedicalRecordListAPIView,
    ReceptionistTodayAppointmentsAPIView,
    ReceptionistAppointmentsByDateAPIView,
    ReceptionistAppointmentCreateAPIView,
    GenerateTokenAPIView,
    CheckInAPIView,
    WalkInCreateAPIView,
    VisitorLogCreateAPIView,
    VisitorCheckoutAPIView,
    ReceptionistDepartmentListAPIView,
    ReceptionistDoctorListAPIView,
)

app_name = 'receptionist'

urlpatterns = [
    path('dashboard/',                                      ReceptionistDashboardAPIView.as_view(),             name='dashboard'),

    # Patients
    path('patients/register/',                              PatientRegisterAPIView.as_view(),                   name='patient-register'),
    path('patients/',                                       PatientListAPIView.as_view(),                       name='patient-list'),
    path('patients/<int:patient_id>/',                      PatientDetailAPIView.as_view(),                     name='patient-detail'),
    path('patients/<int:patient_id>/update/',               PatientUpdateAPIView.as_view(),                     name='patient-update'),
    path('patients/<int:patient_id>/toggle-block/',         PatientBlockToggleAPIView.as_view(),                name='patient-toggle-block'),
    path('patients/<int:patient_id>/medical-records/',      ReceptionistPatientMedicalRecordListAPIView.as_view(), name='patient-medical-records'),

    # Appointments
    path('appointments/today/',                             ReceptionistTodayAppointmentsAPIView.as_view(),     name='appointments-today'),
    path('appointments/by-date/',                           ReceptionistAppointmentsByDateAPIView.as_view(),    name='appointments-by-date'),
    path('appointments/create/',                            ReceptionistAppointmentCreateAPIView.as_view(),     name='appointments-create'),

    # Token & Check-in
    path('generate-token/<int:appointment_id>/',            GenerateTokenAPIView.as_view(),                     name='generate-token'),
    path('check-in/<int:appointment_id>/',                  CheckInAPIView.as_view(),                           name='check-in'),

    # Walk-ins & Visitors
    path('walkin/',                                         WalkInCreateAPIView.as_view(),                      name='walkin-create'),
    path('visitor/',                                        VisitorLogCreateAPIView.as_view(),                  name='visitor-create'),
    path('visitor/checkout/<int:visitor_id>/',              VisitorCheckoutAPIView.as_view(),                   name='visitor-checkout'),

    # Reference data
    path('departments/',                                    ReceptionistDepartmentListAPIView.as_view(),        name='departments'),
    path('doctors/',                                        ReceptionistDoctorListAPIView.as_view(),            name='doctors'),
]