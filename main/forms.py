from django import forms
from django.contrib.auth.forms import UserCreationForm

from .models import *


class RegisterUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('user_type', 'username', 'password1', 'password2', 'birth_date', 'profile')


class AddAssignmentForm(forms.ModelForm):
    class Meta:
        model = Assignment
        fields = ('title', 'assignment_type', 'status')