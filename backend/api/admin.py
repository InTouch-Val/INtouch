from django.contrib import admin

from .models import User, Assignment, AssignmentClient


@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "username",
        "first_name",
        "last_name",
        "email",
        "add_date",
        "new_email_changing",
        "new_email_temp",
    )
    list_display_links = ("username",)
    search_fields = ("username",)
    list_filter = ("username", "email")
    empty_value_display = "-пусто-"


@admin.register(Assignment)
class AssignmentsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "tags",
        "assignment_type",
        "text",
        "author",
        "title",
    )
    list_display_links = ("title",)
    search_fields = ("title",)
    list_filter = ("title", "tags")
    empty_value_display = "-пусто-"


@admin.register(AssignmentClient)
class AssignmentClientAdmin(admin.ModelAdmin):
    list_display = ("id", "tags", "assignment_type", "text", "author", "title", "user")
    list_display_links = ("title",)
    search_fields = ("title",)
    list_filter = ("title", "tags")
    empty_value_display = "-пусто-"
