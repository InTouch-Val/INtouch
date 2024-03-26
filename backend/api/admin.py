from django.contrib import admin

from .models import User, ConfirmationCode


@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id',
                    'username',
                    'first_name',
                    'last_name',
                    'email',
                    'add_date')
    list_display_links = ('username',)
    search_fields = ('username',)
    list_filter = ('username', 'email')
    empty_value_display = '-пусто-'

@admin.register(ConfirmationCode)
class ConfirmationCodeAdmin(admin.ModelAdmin):
    list_display = ('id',
                    'user',
                    'code',
                    'is_confirmed')
    list_display_links = ('user',)
