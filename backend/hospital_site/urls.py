from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

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

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)