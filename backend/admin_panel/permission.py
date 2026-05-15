from rest_framework.permissions import BasePermission


class IsHospitalAdmin(BasePermission):
    message = "Access restricted to hospital admins only."

    def has_permission(self, request, view):

        print("USER:", request.user)
        print("ROLE:", getattr(request.user, "role", None))
        print("AUTH:", request.user.is_authenticated)

        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) == 'admin'
        )