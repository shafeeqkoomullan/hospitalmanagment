from django.urls import path
from .views import (
    PatientListAPIView,
    PatientDetailAPIView,
    PatientBlockToggleAPIView,
    PatientMeAPIView,
    MedicalRecordListAPIView,
    MedicalRecordDetailAPIView,
    MedicalReportUploadAPIView,
    FeedbackCreateAPIView,
    FeedbackListAPIView,
    SupportTicketCreateAPIView,
    SupportTicketAdminAPIView,
    SupportTicketStatusUpdateAPIView,
    AdmissionCreateAPIView,
    AdmissionListAPIView,
    AdmissionDischargeAPIView,
)

app_name = 'patients'

urlpatterns = [
    # Patient self-profile
    path('me/',                                         PatientMeAPIView.as_view(),                 name='me'),

    # Patient list & detail (receptionist/admin)
    path('',                                            PatientListAPIView.as_view(),               name='list'),
    path('<int:pk>/',                                   PatientDetailAPIView.as_view(),             name='detail'),
    path('<int:pk>/block/',                             PatientBlockToggleAPIView.as_view(),        name='block-toggle'),

    # Medical records
    path('<int:patient_id>/records/',                   MedicalRecordListAPIView.as_view(),         name='record-list'),
    path('records/<int:pk>/',                           MedicalRecordDetailAPIView.as_view(),       name='record-detail'),
    path('records/<int:record_id>/reports/',            MedicalReportUploadAPIView.as_view(),       name='report-upload'),

    # Feedback
    path('feedback/',                                   FeedbackCreateAPIView.as_view(),            name='feedback-create'),
    path('feedback/all/',                               FeedbackListAPIView.as_view(),              name='feedback-list'),

    # Support tickets
    path('tickets/',                                    SupportTicketCreateAPIView.as_view(),       name='ticket-create'),
    path('tickets/all/',                                SupportTicketAdminAPIView.as_view(),        name='ticket-admin'),
    path('tickets/<int:pk>/status/',                    SupportTicketStatusUpdateAPIView.as_view(), name='ticket-status'),

    # Admissions
    path('admissions/',                                 AdmissionListAPIView.as_view(),             name='admission-list'),
    path('admissions/admit/',                           AdmissionCreateAPIView.as_view(),           name='admission-create'),
    path('admissions/<int:pk>/discharge/',              AdmissionDischargeAPIView.as_view(),        name='admission-discharge'),
]