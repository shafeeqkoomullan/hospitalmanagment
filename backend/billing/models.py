import uuid
from django.db import models
from django.utils import timezone


class Bill(models.Model):
    STATUS_PAID    = 'Paid'
    STATUS_PARTIAL = 'Partial'
    STATUS_UNPAID  = 'Unpaid'
    STATUS_OVERDUE = 'Overdue'

    STATUS_CHOICES = [
        (STATUS_PAID,    'Paid'),
        (STATUS_PARTIAL, 'Partial'),
        (STATUS_UNPAID,  'Unpaid'),
        (STATUS_OVERDUE, 'Overdue'),
    ]

    patient = models.ForeignKey(
        'patients.Patient',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='bills'
    )
    appointment = models.ForeignKey(
        'appointments.Appointment',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='bills'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    bill_date = models.DateField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_UNPAID)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-bill_date']

    def __str__(self):
        patient_name = self.patient.user.username if self.patient else 'Unknown'
        return f'Bill #{self.id} - {patient_name} ({self.status})'

    def total_paid(self):
        from django.db.models import Sum
        return self.payments.aggregate(total=Sum('amount_paid'))['total'] or 0

    def balance_due(self):
        return self.amount - self.total_paid()

    def refresh_status(self):
        """Auto-update status based on payments and due date."""
        paid = self.total_paid()
        is_overdue = self.due_date and self.due_date < timezone.now().date()

        if paid >= self.amount:
            # FIX: Fully paid always wins regardless of due date
            self.status = self.STATUS_PAID
        elif paid > 0:
            # FIX: Partial payment — respect overdue if due date has passed
            self.status = self.STATUS_OVERDUE if is_overdue else self.STATUS_PARTIAL
        else:
            # FIX: No payment — respect overdue if due date has passed
            self.status = self.STATUS_OVERDUE if is_overdue else self.STATUS_UNPAID

        self.save(update_fields=['status'])


class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('Cash', 'Cash'),
        ('Card', 'Card'),
        ('UPI', 'UPI'),
        ('Insurance', 'Insurance'),
        ('Other', 'Other'),
    ]

    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='payments')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=32, choices=PAYMENT_METHOD_CHOICES, default='Cash')
    payment_date = models.DateTimeField(auto_now_add=True)
    receipt_number = models.CharField(max_length=120, unique=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-payment_date']

    def save(self, *args, **kwargs):
        if not self.receipt_number:
            self.receipt_number = f'RCP-{uuid.uuid4().hex[:10].upper()}'
        super().save(*args, **kwargs)
        # Auto-refresh bill status after every payment save
        self.bill.refresh_status()

    def __str__(self):
        return f'Payment {self.receipt_number} - ₹{self.amount_paid}'
