from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('accounts/', include('accounts.urls')),
    path('receptionist/', include('receptionist.urls')),
    path('patients/', include('patients.urls')),
    path('doctorapp/', include('doctorapp.urls')),
    path('billing/', include('billing.urls')),
    path('appointments/', include('appointments.urls')),
    path('admin-panel/', include('admin_panel.urls')),     
    path('core/', include('core.urls')),
]
