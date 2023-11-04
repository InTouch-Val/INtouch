from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    birth_date = models.DateField(null=True)
    update_date = models.DateTimeField(auto_now=True)
    add_date = models.DateTimeField(auto_now_add=True)
    profile = models.TextField(blank=True)
    accept_policy = models.BooleanField(default=False)
    assignments = models.ManyToManyField('Assignment')

    def __str__(self):
        return self.username


class Client(User):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username


class Assignment(models.Model):
    title = models.CharField(max_length=100)
    update_date = models.DateField(auto_now=True)
    add_date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    assignment_type = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    comments = models.ManyToManyField('Comment')

    def __str__(self):
        return self.title


class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    text = models.TextField()
    add_date = models.DateTimeField(auto_now_add=True)


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
