from django import forms
from django.contrib.auth.forms import UserCreationForm

from .models import User


class RegisterUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('user_type', 'username', 'password1', 'password2', 'birth_date', 'profile')