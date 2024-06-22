import csv
import datetime as dt

from django.http import HttpResponse
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.db.models import Avg, QuerySet, Count, Subquery, OuterRef, When, Case, F
from django.db.models.lookups import GreaterThan

from api.models import User, Client, AssignmentClient, Assignment, DiaryNote
from api.constants import USER_TYPES, METRICS_TABLE_ROWS

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


def get_therapists_metrics_query(
    date_from: dt.datetime, date_to: dt.datetime
) -> QuerySet:
    """Function to get a query of psychotherapists metrics."""
    last_invited = Client.objects.filter(user__doctors=OuterRef("pk")).order_by(
        "-user__add_date"
    )
    last_sent_assignment = AssignmentClient.objects.filter(
        author=OuterRef("pk")
    ).order_by("-add_date")
    last_created_assignment = Assignment.objects.filter(author=OuterRef("pk")).order_by(
        "-add_date"
    )
    query = (
        User.objects.all()
        .filter(
            user_type=USER_TYPES[1], date_joined__gt=date_from, date_joined__lt=date_to
        )
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


def get_clients_metrics_query(date_from: dt.datetime, date_to: dt.datetime) -> QuerySet:
    """Function to get a query of clients metrics."""
    last_done_assignment = AssignmentClient.objects.filter(
        user=OuterRef("pk"), status="done"
    ).order_by("-update_date")
    last_created_diary = DiaryNote.objects.filter(author=OuterRef("pk")).order_by(
        "-add_date"
    )
    query = (
        User.objects.all()
        .filter(
            user_type=USER_TYPES[0], date_joined__gt=date_from, date_joined__lt=date_to
        )
        .annotate(
            last_done_assignment=Subquery(
                last_done_assignment.values("update_date")[:1]
            ),
            rolling_retention_7d=Case(
                When(
                    GreaterThan(
                        F("last_done_assignment") - F("date_joined"),
                        dt.timedelta(days=7),
                    ),
                    then=True,
                ),
                default=False,
            ),
            rolling_retention_30d=Case(
                When(
                    GreaterThan(
                        F("last_done_assignment") - F("date_joined"),
                        dt.timedelta(days=30),
                    ),
                    then=True,
                ),
                default=False,
            ),
            last_created_diary=Subquery(last_created_diary.values("add_date")[:1]),
        )
    )
    return query


def form_metrics_file(
    response: HttpResponse,
    for_whom: str,
    date_from: dt.datetime,
    date_to: dt.datetime,
) -> None:
    "Function for forming metrics files. Depend on for_whom parameter."
    writer = csv.writer(response)
    writer.writerow(METRICS_TABLE_ROWS[for_whom])
    if for_whom == "clients":
        users = get_clients_metrics_query(date_from, date_to)
        for user in users:
            writer.writerow(
                [
                    user.id,
                    user.date_joined,
                    user.rolling_retention_7d,
                    user.rolling_retention_30d,
                    user.last_login,
                    user.last_done_assignment,
                    user.last_created_diary,
                    user.deleted_on,
                ]
            )
    elif for_whom == "therapists":
        users = get_therapists_metrics_query(date_from, date_to)
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
                    user.deleted_on,
                ]
            )
