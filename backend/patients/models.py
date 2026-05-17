from django.db import models
from accounts.models import CustomUser
from core.models import AuditModel
import uuid


class Patient(AuditModel):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="patient_profile"
    )
    patient_id = models.CharField(max_length=20, unique=True, editable=False)
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    GENDER_CHOICES = (("male","Male"),("female","Female"),("other","Other"))
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    blood_group = models.CharField(max_length=5, blank=True)
    emergency_contact = models.CharField(max_length=20, blank=True)
    is_blocked = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.patient_id:
            self.patient_id = f"PAT-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} ({self.patient_id})"


class MedicalRecord(AuditModel):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="medical_records")
    doctor = models.ForeignKey(
        "doctorapp.Doctor",         # ← string reference, no import
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="patient_medical_records"
    )
    diagnosis = models.TextField()
    prescription = models.TextField(blank=True)
    test_results = models.TextField(blank=True)

    def __str__(self):
        return f"Medical Record - {self.patient.patient_id}"


class MedicalReport(AuditModel):
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name="reports")
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to="patients/reports/")

    def __str__(self):
        return f"Report - {self.title}"


class Feedback(AuditModel):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="feedbacks")
    doctor = models.ForeignKey(
        "doctorapp.Doctor",         # ← string reference, no import
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="patient_feedbacks"
    )
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)

    def __str__(self):
        return f"Feedback - {self.patient.patient_id}"


class SupportTicket(AuditModel):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="support_tickets")
    subject = models.CharField(max_length=100)
    message = models.TextField()
    STATUS_CHOICES = (("open","Open"),("in_progress","In Progress"),("resolved","Resolved"))
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")

    def __str__(self):
        return f"Ticket - {self.patient.patient_id}"


class Admission(AuditModel):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="admissions")
    admitted_on = models.DateTimeField(auto_now_add=True)
    discharged_on = models.DateTimeField(null=True, blank=True)
    room_number = models.CharField(max_length=10)
    reason = models.TextField()

    def __str__(self):
        return f"Admission - {self.patient.patient_id}"