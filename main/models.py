from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    birth_date = models.DateField(null=True)
    update_date = models.DateTimeField(auto_now=True)
    add_date = models.DateTimeField(auto_now_add=True)
    profile = models.TextField(blank=True)
    accept_policy = models.BooleanField(default=False)


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
    title = models.CharField(max_length=100)
    update_date = models.DateField(auto_now=True)
    author = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True)
    executor = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True)
    assignment_type = models.CharField(max_length=100, choices=TYPE_LIST)
    status = models.CharField(max_length=100, choices=STATUS_LIST)
    favorites = models.BooleanField(default=False)
    trash = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Massage(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='sent_massages')
    recipient = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='received_massages')
    massage = models.TextField()
    post_date = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
