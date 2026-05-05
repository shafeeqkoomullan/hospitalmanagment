from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    USER_ROLES = [
        ('admin', 'Admin'),
        ('receptionist', 'Receptionist'),
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=32, choices=USER_ROLES, default='patient')

    def __str__(self):
        return f"{self.username} ({self.role})"