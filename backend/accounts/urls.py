from django.urls import path
from .views import (
    LoginAPIView,
    LogoutAPIView,
    MeAPIView,
    ChangePasswordAPIView,
    AccountListAPIView,
    AccountCreateAPIView,
    AccountDetailAPIView,
    AccountUpdateAPIView,
    AccountRoleChangeAPIView,
    AccountToggleActiveAPIView,
    AccountDeleteAPIView,
)

app_name = 'accounts'

urlpatterns = [
    # Auth
    path('auth/login/',           LoginAPIView.as_view(),           name='login'),
    path('auth/logout/',          LogoutAPIView.as_view(),          name='logout'),
    path('auth/me/',              MeAPIView.as_view(),              name='me'),
    path('auth/change-password/', ChangePasswordAPIView.as_view(),  name='change-password'),

    path('accounts/',                      AccountListAPIView.as_view(),        name='account-list'),
    path('accounts/create/',               AccountCreateAPIView.as_view(),      name='account-create'),
    path('accounts/<int:pk>/',             AccountDetailAPIView.as_view(),      name='account-detail'),
    path('accounts/<int:pk>/update/',      AccountUpdateAPIView.as_view(),      name='account-update'),
    path('accounts/<int:pk>/delete/',      AccountDeleteAPIView.as_view(),      name='account-delete'),
    path('accounts/<int:pk>/toggle/',      AccountToggleActiveAPIView.as_view(),name='account-toggle'),
    path('accounts/<int:pk>/change-role/', AccountRoleChangeAPIView.as_view(),  name='account-change-role'),
]