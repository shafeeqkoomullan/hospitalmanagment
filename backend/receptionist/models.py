from django.db import models
from accounts.models import CustomUser
from patients.models import Patient
from doctorapp.models import Doctor
from core.models import AuditModel
import uuid


class Receptionist(AuditModel):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='receptionist_profile')

    employee_id = models.CharField(max_length=20, unique=True, blank=True)

    shift = models.CharField(
        max_length=20,
        choices=(
            ('Morning', 'Morning'),
            ('Evening', 'Evening'),
            ('Night', 'Night'),
        ),
        default='Morning'
    )

    def save(self, *args, **kwargs):
        if not self.employee_id:
            self.employee_id = f'REC-{uuid.uuid4().hex[:8].upper()}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.user.username} ({self.employee_id})'


class CheckIn(AuditModel):
    appointment = models.OneToOneField(
        'appointments.Appointment',
        on_delete=models.CASCADE,
        related_name='checkin'
    )
    receptionist = models.ForeignKey(
        Receptionist,
        on_delete=models.SET_NULL,
        null=True,
        related_name='checkins'
    )
    checkin_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Check-In → {self.appointment.patient}'


class WalkIn(AuditModel):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='walkins')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='walkins')
    receptionist = models.ForeignKey(
        Receptionist,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='walkins'
    )
    token_number = models.PositiveIntegerField()
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Walk-In → {self.patient} (Token: {self.token_number})'


class VisitorLog(AuditModel):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='visitor_logs')
    receptionist = models.ForeignKey(
        Receptionist,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='visitor_logs'
    )
    visitor_name = models.CharField(max_length=100)
    relation = models.CharField(max_length=50, blank=True)
    check_in_time = models.DateTimeField(auto_now_add=True)
    check_out_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Visitor: {self.visitor_name} → {self.patient}'


class Token(AuditModel):
    appointment = models.OneToOneField(
        'appointments.Appointment',
        on_delete=models.CASCADE,
        related_name='appointment_token'
    )
    issued_by = models.ForeignKey(           # ← was missing, caused crash
        Receptionist,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='issued_tokens'
    )
    token_number = models.PositiveIntegerField()
    issued_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('appointment', 'token_number')

    def __str__(self):
        return f'Token {self.token_number} → {self.appointment.patient}'