from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.db.models import Sum, Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsReceptionistOrAdmin, IsAdmin

from .models import Bill, Payment
from .serializers import BillSerializer, BillCreateSerializer, PaymentSerializer

# FIX: Removed 'from core.utils import log_action' — core app does not exist
# in this project. Logging is handled inline using ActivityLog directly.
from admin_panel.models import ActivityLog


def _actor_role(user):
    return user.role if hasattr(user, 'role') else 'unknown'


def _log(user, action):
    """Safe inline logger using ActivityLog model."""
    try:
        ActivityLog.objects.create(user=user, action=action)
    except Exception:
        pass  # Never let logging crash a request


# ── Bills ─────────────────────────────────────────────────────────────────────

class BillListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def get(self, request):
        bills = Bill.objects.select_related('patient__user', 'appointment').prefetch_related('payments')

        # Filters
        bill_status = request.query_params.get('status')
        patient_id  = request.query_params.get('patient')
        date        = request.query_params.get('date')

        if bill_status:
            bills = bills.filter(status=bill_status)
        if patient_id:
            bills = bills.filter(patient_id=patient_id)
        if date:
            bills = bills.filter(bill_date=date)

        return Response(BillSerializer(bills, many=True).data)

    def post(self, request):
        serializer = BillCreateSerializer(data=request.data)
        if serializer.is_valid():
            bill = serializer.save()
            _log(request.user, f"Created bill #{bill.id}")
            return Response(BillSerializer(bill).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BillDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def get(self, request, pk):
        bill = get_object_or_404(
            Bill.objects.select_related('patient__user').prefetch_related('payments'),
            pk=pk
        )
        return Response(BillSerializer(bill).data)

    def patch(self, request, pk):
        bill = get_object_or_404(Bill, pk=pk)
        serializer = BillCreateSerializer(bill, data=request.data, partial=True)
        if serializer.is_valid():
            bill = serializer.save()
            _log(request.user, f"Updated bill #{bill.id}")
            return Response(BillSerializer(bill).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        bill = get_object_or_404(Bill, pk=pk)
        _log(request.user, f"Deleted bill #{bill.id}")
        bill.delete()
        # FIX: 204 No Content must not include a body
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── Payments ──────────────────────────────────────────────────────────────────

class PaymentListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def get(self, request):
        payments = Payment.objects.select_related('bill__patient__user').all()

        bill_id = request.query_params.get('bill')
        if bill_id:
            payments = payments.filter(bill_id=bill_id)

        return Response(PaymentSerializer(payments, many=True).data)

    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            payment = serializer.save()
            _log(request.user, f"Recorded payment {payment.receipt_number}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def get(self, request, pk):
        payment = get_object_or_404(Payment, pk=pk)
        return Response(PaymentSerializer(payment).data)

    def delete(self, request, pk):
        # FIX: Updated docstring — no signal involved, uses direct method call
        """Deleting a payment recalculates bill status via bill.refresh_status()."""
        payment = get_object_or_404(Payment, pk=pk)
        bill = payment.bill
        payment.delete()
        bill.refresh_status()
        _log(request.user, f"Deleted payment from bill #{bill.id}")
        # FIX: Changed 204 (no body) to 200 so the message is actually delivered
        return Response(
            {"message": "Payment deleted and bill status updated."},
            status=status.HTTP_200_OK
        )


# ── Dashboard ─────────────────────────────────────────────────────────────────

class BillingDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated, IsReceptionistOrAdmin]

    def get(self, request):
        today = now().date()

        daily_earnings = (
            Payment.objects.filter(payment_date__date=today)
            .aggregate(total=Sum('amount_paid'))['total'] or 0
        )

        monthly_earnings = (
            Payment.objects.filter(
                payment_date__year=today.year,
                payment_date__month=today.month
            ).aggregate(total=Sum('amount_paid'))['total'] or 0
        )

        total_bills   = Bill.objects.count()
        paid_bills    = Bill.objects.filter(status=Bill.STATUS_PAID).count()
        unpaid_bills  = Bill.objects.filter(status=Bill.STATUS_UNPAID).count()
        partial_bills = Bill.objects.filter(status=Bill.STATUS_PARTIAL).count()
        overdue_bills = Bill.objects.filter(status=Bill.STATUS_OVERDUE).count()

        # Single query for unpaid amount — no N+1
        unpaid_amount = (
            Bill.objects.filter(status__in=[Bill.STATUS_UNPAID, Bill.STATUS_PARTIAL, Bill.STATUS_OVERDUE])
            .aggregate(total=Sum('amount'))['total'] or 0
        ) - (
            Payment.objects.filter(bill__status__in=[Bill.STATUS_UNPAID, Bill.STATUS_PARTIAL, Bill.STATUS_OVERDUE])
            .aggregate(total=Sum('amount_paid'))['total'] or 0
        )

        # FIX: Clamp to zero — overpayments could otherwise produce a negative value
        unpaid_amount = max(0, unpaid_amount)

        recent_bills = Bill.objects.select_related('patient__user').order_by('-bill_date')[:5]

        return Response({
            "daily_earnings":   float(daily_earnings),
            "monthly_earnings": float(monthly_earnings),
            "bills": {
                "total":   total_bills,
                "paid":    paid_bills,
                "unpaid":  unpaid_bills,
                "partial": partial_bills,
                "overdue": overdue_bills,
            },
            "unpaid_amount": float(unpaid_amount),
            "recent_bills":  BillSerializer(recent_bills, many=True).data,
        })
