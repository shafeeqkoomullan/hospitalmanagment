from django.contrib import admin
from .models import Bill, Payment


class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ['receipt_number', 'payment_date']


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'amount', 'total_paid', 'balance_due', 'status', 'bill_date', 'due_date']
    list_filter = ['status', 'bill_date']
    search_fields = ['patient__user__username', 'description']
    readonly_fields = ['bill_date', 'created_at', 'updated_at']
    inlines = [PaymentInline]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['receipt_number', 'bill', 'amount_paid', 'payment_method', 'payment_date']
    search_fields = ['receipt_number', 'bill__patient__user__username']
    readonly_fields = ['receipt_number', 'payment_date']
    list_filter = ['payment_method', 'payment_date']