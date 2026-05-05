from django.urls import path
from . import views

app_name = 'billing'

urlpatterns = [
    path('bills/', views.BillListCreateAPIView.as_view(), name='bill-list'),
    path('bills/<int:pk>/', views.BillDetailAPIView.as_view(), name='bill-detail'),
    path('payments/', views.PaymentListCreateAPIView.as_view(), name='payment-list'),
    path('payments/<int:pk>/', views.PaymentDetailAPIView.as_view(), name='payment-detail'),
    path('dashboard/', views.BillingDashboardAPIView.as_view(), name='dashboard'),
]
