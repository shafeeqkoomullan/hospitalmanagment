from rest_framework.permissions import BasePermission


class IsHospitalAdmin(BasePermission):
    message = "Access restricted to hospital admins only."

    def has_permission(self, request, view):
        # FIX: Removed debug print statements
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) == 'admin'
        )
