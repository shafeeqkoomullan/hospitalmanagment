from rest_framework import serializers

from .models import Bill, Payment


# =========================================================
# Payment Serializer
# =========================================================

class PaymentSerializer(serializers.ModelSerializer):

    patient_name = serializers.SerializerMethodField()

    class Meta:

        model = Payment

        fields = [

            'id',

            'bill',

            'patient_name',

            'amount_paid',

            'payment_method',

            'payment_date',

            'receipt_number',

            'notes',

        ]

        read_only_fields = [

            'id',

            'payment_date',

            'receipt_number',

        ]

    # =============================================
    # Patient Name
    # =============================================

    def get_patient_name(self, obj):

        if (
            obj.bill and
            obj.bill.patient and
            obj.bill.patient.user
        ):

            name = f"""
                {obj.bill.patient.user.first_name}
                {obj.bill.patient.user.last_name}
            """.strip()

            return (
                name or
                obj.bill.patient.user.username
            )

        return None

    # =============================================
    # Validation
    # =============================================

    def validate_amount_paid(self, value):

        if value <= 0:

            raise serializers.ValidationError(
                "Payment amount must be greater than zero."
            )

        return value


# =========================================================
# Bill Serializer
# =========================================================

class BillSerializer(serializers.ModelSerializer):

    patient_name = serializers.SerializerMethodField()

    payments = PaymentSerializer(
        many=True,
        read_only=True
    )

    total_paid = serializers.SerializerMethodField()

    balance_due = serializers.SerializerMethodField()

    class Meta:

        model = Bill

        fields = [

            'id',

            'patient',

            'patient_name',

            'appointment',

            'amount',

            'bill_date',

            'due_date',

            'status',

            'description',

            'payments',

            'total_paid',

            'balance_due',

            'created_at',

            'updated_at',

        ]

        read_only_fields = [

            'id',

            'bill_date',

            'status',

            'created_at',

            'updated_at',

        ]

    # =============================================
    # Patient Name
    # =============================================

    def get_patient_name(self, obj):

        if obj.patient and obj.patient.user:

            name = f"""
                {obj.patient.user.first_name}
                {obj.patient.user.last_name}
            """.strip()

            return (
                name or
                obj.patient.user.username
            )

        return None

    # =============================================
    # Total Paid
    # =============================================

    def get_total_paid(self, obj):

        return float(obj.total_paid())

    # =============================================
    # Balance Due
    # =============================================

    def get_balance_due(self, obj):

        return float(obj.balance_due())

    # =============================================
    # Validation
    # =============================================

    def validate_amount(self, value):

        if value <= 0:

            raise serializers.ValidationError(
                "Bill amount must be greater than zero."
            )

        return value


# =========================================================
# Bill Create Serializer
# =========================================================

class BillCreateSerializer(serializers.ModelSerializer):

    class Meta:

        model = Bill

        fields = [

            'patient',

            'appointment',

            'amount',

            'due_date',

            'description',

        ]

    # =============================================
    # Validation
    # =============================================

    def validate_amount(self, value):

        if value <= 0:

            raise serializers.ValidationError(
                "Bill amount must be greater than zero."
            )

        return value

    # =============================================
    # Auto Fill Patient from Appointment
    # =============================================

    def create(self, validated_data):

        appointment = validated_data.get('appointment')

        if appointment and not validated_data.get('patient'):

            validated_data['patient'] = appointment.patient

        return super().create(validated_data)