"""Модуль содержит дополнительные пользовательские функции и перемменные"""

from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.db.models import Avg, QuerySet

current_site = "https://app.intouch.care"


def send_by_mail(html_message, email):
    """Функция отправки письма на email"""
    message = strip_tags(html_message)
    mail = EmailMultiAlternatives(
        "Welcome to INtouch!",
        message,
        "info@intouch.care",
        [email],
    )
    mail.attach_alternative(html_message, "text/html")
    mail.send()


def avg_grade_annotation(query: QuerySet) -> QuerySet:
    """Function for the annotation of an Assignment avarage grade."""
    return query.annotate(avarage_grade=Avg("assignments_clients__grade", default=0))
