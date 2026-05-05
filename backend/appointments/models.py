from django.db import models


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('Checked In', 'Checked In'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
        ('No Show', 'No Show'),
    ]

    patient = models.ForeignKey(
        'patients.Patient',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='appointments'
    )

    doctor = models.ForeignKey(
        'doctorapp.Doctor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='appointments'
    )

    created_by = models.ForeignKey(
        'accounts.CustomUser',   # ✅ FIXED
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_appointments'
    )

    appointment_date = models.DateField()
    appointment_time = models.TimeField(null=True, blank=True)

    token_number = models.CharField(max_length=64, blank=True, null=True)
    reason = models.TextField(blank=True)

    status = models.CharField(
        max_length=32,
        choices=STATUS_CHOICES,
        default='Scheduled'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['appointment_date', 'appointment_time']

    def __str__(self):
        return f'{self.patient} → {self.doctor} on {self.appointment_date}'