import dramatiq

from .models import User


@dramatiq.actor
def remove_unverified_user(pk):
    user = User.objects.get(pk=pk)
    if not user.is_active:
        user.delete()