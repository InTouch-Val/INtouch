import csv
import datetime as dt

from django.http import HttpResponse
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


def get_therapists_metrics_query() -> QuerySet:
    """Function to get a query of psychotherapists metrics."""
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
            last_invited=Subquery(last_invited.values("user__add_date")[:1]),
            last_sent_assignment=Subquery(last_sent_assignment.values("add_date")[:1]),
            last_created_assignment=Subquery(
                last_created_assignment.values("add_date")[:1]
            ),
        )
    )
    return query


def form_metrics_file(response: HttpResponse) -> None:
    """Form a csv metrics data file."""
    writer = csv.writer(response)
    writer.writerow(
        [
            "User ID",
            "Registration Date",
            "Rolling Retention 7D",
            "Rolling Retention 30D",
            "Last Seen",
            "Clients Invited",
            "Last Invited Client",
            "Last Sent Assignment",
            "Last Created Assignment",
            "Deleted On",
        ]
    )
    users = get_therapists_metrics_query()
    for user in users:
        writer.writerow(
            [
                user.id,
                user.date_joined,
                user.rolling_retention_7d,
                user.rolling_retention_30d,
                user.last_login,
                user.clients_count,
                user.last_invited,
                user.last_sent_assignment,
                user.last_created_assignment,
            ]
        )
