from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    TYPE_CHOICES = (
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
    )
    name = models.CharField(max_length=100)
    birth_date = models.DateField()
    update_date = models.DateField(auto_now=True)
    about_me = models.TextField()
    user_type = models.CharField(choices=TYPE_CHOICES)


class Doctor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)


class Patient(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True)
    diagnosis = models.CharField(max_length=100)


class Assignment(models.Model):
    TYPE_LIST = (
        ('exercise', 'Exercise'),
        ('lesson', 'Lesson'),
        ('metaphor', 'Metaphor'),
    )
    STATUS_LIST = (
        ('in progress', 'In progress'),
        ('publish', 'publish'),
        ('expansion', 'expansion'),
    )
    title = models.CharField(max_length=100)
    update_date = models.DateField(auto_now=True)
    author = models.CharField(max_length=100)
    assignment_type = models.CharField(choices=TYPE_LIST)
    status = models.CharField(choices=STATUS_LIST)