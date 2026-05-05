from django.db import models
from accounts.models import CustomUser
from admin_panel.models import Department
from core.models import AuditModel


class Doctor(AuditModel):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="doctor_profile"
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="doctors"
    )

    specialization = models.CharField(max_length=50)
    license_no = models.CharField(max_length=50, unique=True)
    qualification = models.CharField(max_length=100)
    years_of_experience = models.PositiveIntegerField(default=0)

    image = models.ImageField(
        upload_to="doctors/",
        null=True,
        blank=True
    )

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} ({self.department})"


class Prescription(AuditModel):
    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name="prescriptions"
    )

    patient = models.ForeignKey(
        "patients.Patient",
        on_delete=models.CASCADE,
        related_name="prescriptions"
    )

    diagnosis = models.TextField()
    medicines = models.TextField()
    notes = models.TextField(blank=True)

    # keep this — business date, NOT audit date
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Prescription → {self.patient.patient_id}"
