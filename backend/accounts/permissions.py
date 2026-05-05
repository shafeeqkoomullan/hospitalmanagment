from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    message = "Access restricted to admins only."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) == 'admin'
        )


class IsDoctor(BasePermission):
    message = "Access restricted to doctors only."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) == 'doctor'
        )


class IsPatient(BasePermission):
    message = "Access restricted to patients only."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) == 'patient'
        )


class IsReceptionist(BasePermission):
    message = "Access restricted to receptionists only."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) == 'receptionist'
        )


class IsReceptionistOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) in ['receptionist', 'admin']
        )


class IsOwnerOrAdmin(BasePermission):
    message = "You do not have permission to access this account."

    def has_object_permission(self, request, view, obj):
        return obj == request.user or getattr(request.user, 'role', None) == 'admin'


class ReadOnlyOrAdmin(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) == 'admin'
        )