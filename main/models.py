from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USER_TYPE = (
        ('doctor', 'Doctor'),
        ('client', 'Client'),
    )
    birth_date = models.DateField(null=True)
    update_date = models.DateField(auto_now=True)
    profile = models.TextField()
    user_type = models.CharField(max_length=100, choices=USER_TYPE, default='doctor')


class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username


class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True)
    diagnosis = models.CharField(max_length=100, blank=True)
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username


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
    CATEGORY_LIST = (
        ('favorites', 'Favorites'),
        ('trash', 'Trash'),
        ('library', 'Library')
    )
    title = models.CharField(max_length=100)
    update_date = models.DateField(auto_now=True)
    author = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True)
    assignment_type = models.CharField(max_length=100, choices=TYPE_LIST)
    status = models.CharField(max_length=100, choices=STATUS_LIST)
    category = models.CharField(max_length=100, choices=CATEGORY_LIST, default='library')

    def __str__(self):
        return self.title