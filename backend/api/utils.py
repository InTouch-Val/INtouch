import datetime as dt

from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.db.models import Avg, QuerySet, Count, Subquery, OuterRef, When, Case, F
from django.db.models.lookups import GreaterThan

from api.models import User, Client, AssignmentClient, Assignment
from api.constants import USER_TYPES

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
    """Function for the annotation of an Assignment average grade."""
    return query.annotate(average_grade=Avg("assignments_clients__grade", default=0))


def get_queryset_for_metrics() -> QuerySet:
    last_invited = Client.objects.filter(user__doctors=OuterRef("pk")).order_by(
        "-user__date_joined"
    )
    last_sent_assignment = AssignmentClient.objects.filter(
        author=OuterRef("pk")
    ).order_by("-add_date")
    last_created_assignment = Assignment.objects.filter(author=OuterRef("pk")).order_by(
        "-add_date"
    )
    query = (
        User.objects.all()
        .filter(user_type=USER_TYPES[1])
        .annotate(
            clients_count=Count("doctor__clients"),
            rolling_retention_7d=Case(
                When(
                    GreaterThan(
                        F("last_login") - F("date_joined"), dt.timedelta(days=7)
                    ),
                    then=True,
                ),
                default=False,
            ),
            rolling_retention_30d=Case(
                When(
                    GreaterThan(
                        F("last_login") - F("date_joined"), dt.timedelta(days=30)
                    ),
                    then=True,
                ),
                default=False,
            ),
            last_invited=Subquery(last_invited.values("user__date_joined")[:1]),
            last_sent_assignment=Subquery(last_sent_assignment.values("add_date")[:1]),
            last_created_assignment=Subquery(
                last_created_assignment.values("add_date")[:1]
            ),
        )
    )
    return query
