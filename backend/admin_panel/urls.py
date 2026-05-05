from django.urls import path
from . import views

app_name = 'admin_panel'

urlpatterns = [
    # Dashboard
    path('dashboard/', views.AdminDashboardAPIView.as_view(), name='dashboard'),

    # Departments
    path('departments/', views.DepartmentListCreateAPIView.as_view(), name='departments'),
    path('departments/<int:pk>/', views.DepartmentDetailAPIView.as_view(), name='department-detail'),

    # Designations
    path('designations/', views.DesignationListCreateAPIView.as_view(), name='designations'),
    path('designations/<int:pk>/', views.DesignationDetailAPIView.as_view(), name='designation-detail'),

    # Shifts
    path('shifts/', views.ShiftListCreateAPIView.as_view(), name='shifts'),

    # Create staff
    path('create-receptionist/', views.AdminCreateReceptionistAPIView.as_view(), name='create-receptionist'),
    path('create-doctor/', views.AdminCreateDoctorAPIView.as_view(), name='create-doctor'),

    # User management
    path('toggle-user/<int:user_id>/', views.AdminToggleUserAPIView.as_view(), name='toggle-user'),
    path('delete-user/<int:user_id>/', views.AdminDeleteUserAPIView.as_view(), name='delete-user'),

    # Doctors
    path('doctors/', views.AdminDoctorListAPIView.as_view(), name='doctors'),
    path('doctors/<int:id>/', views.AdminDoctorUpdateDeleteAPIView.as_view(), name='doctor-update-delete'),

    # Appointments & Patients
    path('appointments/', views.AdminAppointmentListAPIView.as_view(), name='appointments'),
    path('patients/', views.AdminPatientListAPIView.as_view(), name='patients'),
]