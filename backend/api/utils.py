"""Модуль содержит дополнительные пользовательские функции и перемменные"""

from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives


current_site = 'https://app.intouch.care'

def send_by_mail(html_message, email):
    """Функция отправки письма на email"""
    message = strip_tags(html_message)
    mail = EmailMultiAlternatives(
        'Welcome to INtouch!',
        message,
        'info@intouch.care',
        [email],
    )
    mail.attach_alternative(html_message, 'text/html')
    mail.send()