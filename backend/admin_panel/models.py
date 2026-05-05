from django.db import models


class Department(models.Model):
    name = models.CharField(max_length=220)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Designation(models.Model):
    name = models.CharField(max_length=220)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Shift(models.Model):
    name = models.CharField(max_length=220)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return self.name


class HospitalSettings(models.Model):
    key = models.CharField(max_length=220, unique=True)
    value = models.TextField()

    def __str__(self):
        return self.key


class NotificationTemplate(models.Model):
    name = models.CharField(max_length=220)
    subject = models.CharField(max_length=220)
    body = models.TextField()

    def __str__(self):
        return self.name


class ActivityLog(models.Model):
    user = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE)
    action = models.CharField(max_length=220)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action}"
