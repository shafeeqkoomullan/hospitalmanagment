from rest_framework import serializers
from .models import Bill, Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'bill', 'amount_paid', 'payment_method',
            'payment_date', 'receipt_number', 'notes'
        ]
        read_only_fields = ['id', 'payment_date', 'receipt_number']

    def validate_amount_paid(self, value):
        if value <= 0:
            raise serializers.ValidationError("Payment amount must be greater than zero.")
        return value


class BillSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    payments = PaymentSerializer(many=True, read_only=True)
    total_paid = serializers.SerializerMethodField()
    balance_due = serializers.SerializerMethodField()

    class Meta:
        model = Bill
        fields = [
            'id', 'patient', 'patient_name',
            'appointment', 'amount', 'bill_date', 'due_date',
            'status', 'description',
            'payments', 'total_paid', 'balance_due',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'bill_date', 'status', 'created_at', 'updated_at']

    def get_patient_name(self, obj):
        if obj.patient and obj.patient.user:
            name = f"{obj.patient.user.first_name} {obj.patient.user.last_name}".strip()
            return name or obj.patient.user.username
        return None

    def get_total_paid(self, obj):
        return float(obj.total_paid())

    def get_balance_due(self, obj):
        return float(obj.balance_due())

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Bill amount must be greater than zero.")
        return value


class BillCreateSerializer(serializers.ModelSerializer):
    """Slim serializer for creating bills — excludes nested payments."""
    class Meta:
        model = Bill
        fields = ['patient', 'appointment', 'amount', 'due_date', 'description']