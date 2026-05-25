from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from core.utils import log_action

from .models import CustomUser
from .serializers import (
    AccountSerializer,
    AccountCreateSerializer,
    AccountUpdateSerializer,
    ChangePasswordSerializer,
)
from .permissions import IsAdmin, IsOwnerOrAdmin


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {"error": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)

        # ✅ Check user FIRST before logging
        if not user:
            return Response(
                {"error": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"error": "This account has been deactivated."},
                status=status.HTTP_403_FORBIDDEN
            )

        # ✅ Log AFTER confirming user is valid
        log_action(
            actor=user,
            role=user.role,
            action="login",
            instance=user,
            request=request
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": AccountSerializer(user).data,
        }, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # ✅ Log before blacklist
        log_action(
            actor=request.user,
            role=request.user.role,
            action="logout",
            instance=request.user,
            request=request
        )
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Logged out successfully."},
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {"error": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST
            )


# ── Current user ──────────────────────────────────────────────────────────────

class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(AccountSerializer(request.user).data)

    def patch(self, request):
        # Strip 'role' to prevent privilege escalation
        data = request.data.copy()
        data.pop('role', None)

        serializer = AccountUpdateSerializer(
            request.user, data=data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            # ✅ Log profile update
            log_action(
                actor=request.user,
                role=request.user.role,
                action="update",
                instance=request.user,
                request=request
            )
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user

        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {"old_password": "Incorrect password."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        # ✅ Log password change
        log_action(
            actor=request.user,
            role=request.user.role,
            action="change_password",
            instance=request.user,
            request=request
        )

        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK
        )


# ── Account Management (Admin only) ───────────────────────────────────────────

class AccountListAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        accounts = CustomUser.objects.all().order_by('-date_joined')

        role = request.query_params.get('role')
        is_active = request.query_params.get('is_active')

        if role:
            accounts = accounts.filter(role=role)

        if is_active is not None:
            accounts = accounts.filter(
                is_active=is_active.lower() in ('true', '1', 'yes')
            )

        return Response(AccountSerializer(accounts, many=True).data)


class AccountCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = AccountCreateSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            # ✅ Log account creation
            log_action(
                actor=request.user,
                role=request.user.role,
                action="create",
                instance=user,
                request=request
            )

            return Response(
                AccountSerializer(user).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class AccountDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get(self, request, pk):
        account = get_object_or_404(CustomUser, pk=pk)
        self.check_object_permissions(request, account)
        return Response(AccountSerializer(account).data)


class AccountUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def patch(self, request, pk):
        account = get_object_or_404(CustomUser, pk=pk)
        self.check_object_permissions(request, account)

        serializer = AccountUpdateSerializer(
            account, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()

            # ✅ Log account update
            log_action(
                actor=request.user,
                role=request.user.role,
                action="update",
                instance=account,
                request=request
            )

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class AccountRoleChangeAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        account = get_object_or_404(CustomUser, pk=pk)
        role = request.data.get('role')
        valid_roles = [r[0] for r in CustomUser.USER_ROLES]

        if role not in valid_roles:
            return Response(
                {"error": f"Invalid role. Choose from: {valid_roles}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        account.role = role
        account.save(update_fields=['role'])

        # ✅ Log role change
        log_action(
            actor=request.user,
            role=request.user.role,
            action="change_role",
            instance=account,
            request=request
        )

        return Response({"id": account.id, "role": account.role})


class AccountToggleActiveAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, pk):
        account = get_object_or_404(CustomUser, pk=pk)

        if account == request.user:
            return Response(
                {"error": "You cannot deactivate your own account."},
                status=status.HTTP_400_BAD_REQUEST
            )

        account.is_active = not account.is_active
        account.save(update_fields=['is_active'])

        # ✅ Log activate/deactivate
        action = "activate" if account.is_active else "deactivate"
        log_action(
            actor=request.user,
            role=request.user.role,
            action=action,
            instance=account,
            request=request
        )

        return Response({"id": account.id, "is_active": account.is_active})


class AccountDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def delete(self, request, pk):
        account = get_object_or_404(CustomUser, pk=pk)

        if account == request.user:
            return Response(
                {"error": "You cannot delete your own account."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Log BEFORE delete — after delete pk is gone
        log_action(
            actor=request.user,
            role=request.user.role,
            action="delete",
            instance=account,
            request=request
        )

        account.delete()

        return Response(
            {"message": "Account deleted."},
            status=status.HTTP_204_NO_CONTENT
        )
