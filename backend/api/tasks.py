"""Модуль содержит функции для выполнения асинхронных задач"""

import dramatiq

from api.models import User


@dramatiq.actor
def remove_unverified_user(pk):
    user = User.objects.get(pk=pk)
    if not user.is_active:
        user.delete()


@dramatiq.actor
def reset_email_update_status(pk):
    user = User.objects.get(pk=pk)
    user.email_changing = False
    user.new_email_temp = None
    user.save()
