from .models import Token, WalkIn


def generate_next_token(doctor, appointment_date):
    """
    Returns next integer token for a doctor on a given date.
    Considers both scheduled appointment tokens and walk-in tokens.
    """
    if doctor is None:
        return 1

    last_appt_token = (
        Token.objects
        .filter(
            appointment__doctor=doctor,
            appointment__appointment_date=appointment_date
        )
        .order_by('-token_number')
        .values_list('token_number', flat=True)
        .first()
    )

    last_walkin_token = (
        WalkIn.objects
        .filter(doctor=doctor, registered_at__date=appointment_date)
        .order_by('-token_number')
        .values_list('token_number', flat=True)
        .first()
    )

    candidates = [t for t in [last_appt_token, last_walkin_token] if t is not None]
    return (max(candidates) + 1) if candidates else 1