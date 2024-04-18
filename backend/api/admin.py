from django.contrib import admin

from .models import User


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
