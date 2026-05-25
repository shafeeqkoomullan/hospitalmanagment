# FIX: Removed unused 'from django.db import models' import


def get_client_ip(request):
    """Extract real IP address from request headers."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


def log_action(actor, role, action, instance, request=None, description=''):
    """
    Creates an ActionLog entry for any create/update/delete/login/logout action.

    Valid actions: 'create', 'update', 'delete', 'login', 'logout'

    Usage:
        log_action(actor=request.user, role='receptionist', action='create', instance=bill)
        log_action(actor=request.user, role='admin', action='delete', instance=doctor, request=request)
    """
    from .models import ActionLog  # local import to avoid circular imports

    # FIX: Validate action against ActionLog.ACTION_CHOICES before saving.
    # Previously any string was accepted, silently storing invalid values.
    valid_actions = [c[0] for c in ActionLog.ACTION_CHOICES]
    if action not in valid_actions:
        raise ValueError(
            f"Invalid action '{action}'. Must be one of: {valid_actions}"
        )

    model_name = instance.__class__.__name__
    object_id  = str(getattr(instance, 'pk', '') or '')

    if not description:
        description = f"{role} performed '{action}' on {model_name} (id={object_id})"

    ip_address = get_client_ip(request) if request else None

    ActionLog.objects.create(
        user=actor,
        role=role,
        action=action,
        model_name=model_name,
        object_id=object_id,
        description=description,
        ip_address=ip_address,
    )
