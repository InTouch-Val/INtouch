from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db import models

from api.constants import (
    ASSIGNMENT_TYPES,
    LANGUAGES,
    PRIMARY_EMOTIONS,
    CLARIFYING_EMOTIONS,
    BLOCK_TYPES,
)


class User(AbstractUser):
    date_of_birth = models.DateField(null=True)
    last_update = models.DateTimeField(auto_now=True)
    add_date = models.DateTimeField(auto_now_add=True)
    user_type = models.CharField(max_length=100)
    accept_policy = models.BooleanField(default=False)
    photo = models.ImageField(
        upload_to="user_photos",
        default="user_photos/default_user_photo.jpg",
        blank=True,
    )
    new_email_changing = models.BooleanField(default=False)
    new_email_temp = models.EmailField(null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Doctor(models.Model):
    user = models.OneToOneField("User", on_delete=models.CASCADE)
    clients = models.ManyToManyField("User", blank=True, related_name="doctors")
    assignments = models.ManyToManyField(
        "Assignment", blank=True
    )  # задания, добавленные в избранное


class Client(models.Model):
    user = models.OneToOneField("User", on_delete=models.CASCADE)
    assignments = models.ManyToManyField("AssignmentClient", blank=True)
    diagnosis = models.CharField(max_length=255, blank=True)
    about = models.TextField(blank=True)
    notes = models.ManyToManyField("Note", blank=True)

    @property
    def last_ivited(self):
        return self.user.date_joined()


class Assignment(models.Model):
    title = models.CharField(max_length=100)
    text = models.TextField()
    update_date = models.DateField(auto_now=True)
    add_date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="assignments",
        null=True,
    )
    assignment_type = models.CharField(max_length=100, choices=ASSIGNMENT_TYPES)
    status = models.CharField(max_length=100)
    tags = models.CharField(max_length=255)
    language = models.CharField(max_length=100, choices=LANGUAGES)
    share = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    image_url = models.CharField(max_length=255)
    blocks = models.ManyToManyField("Block", related_name="assignment", blank=True)
    comments = models.ManyToManyField("Comment", blank=True)
    is_public = models.BooleanField(
        default=True
    )  # состояние - опубликовано или в драфте

    def __str__(self):
        return self.title


class AssignmentClient(models.Model):
    title = models.CharField(max_length=100)
    text = models.TextField()
    update_date = models.DateField(auto_now=True)
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="assignments_clients",
        null=True,
    )
    add_date = models.DateTimeField(auto_now_add=True)
    assignment_type = models.CharField(max_length=100)
    status = models.CharField(max_length=100, default="to do")
    tags = models.CharField(max_length=255)
    language = models.CharField(max_length=100, choices=LANGUAGES)
    share = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    image_url = models.CharField(max_length=255)
    blocks = models.ManyToManyField(
        "Block", related_name="assignment_client", blank=True
    )
    comments = models.ManyToManyField("Comment", blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    visible = models.BooleanField(default=False)  # состояние - видит доктор или нет
    grade = models.IntegerField(null=True, blank=True)  # оценка клиента
    review = models.TextField(null=True, blank=True)
    assignment_root = models.ForeignKey(
        "Assignment",
        on_delete=models.SET_NULL,
        related_name="assignments_clients",
        null=True,
    )  # ссылка на задание, с которого назначено текущее

    class Meta:
        ordering = ["-add_date"]


class Block(models.Model):
    question = models.CharField(max_length=250)
    reply = models.TextField(blank=True)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=10, choices=BLOCK_TYPES)
    choice_replies = models.ManyToManyField("BlockChoice", blank=True)
    start_range = models.IntegerField(default=1)
    end_range = models.IntegerField(default=10)
    left_pole = models.CharField(max_length=50)
    right_pole = models.CharField(max_length=50)
    image = models.ImageField(
        upload_to="block_images",
        blank=True,
    )

    class Meta:
        ordering = ["pk"]


class BlockChoice(models.Model):
    reply = models.CharField(max_length=100)
    checked = models.BooleanField(default=False)

    class Meta:
        ordering = ["pk"]


class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    add_date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="notes",
        null=True,
    )


class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    text = models.TextField()
    add_date = models.DateTimeField(auto_now_add=True)


class Massage(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="sent_massages"
    )
    recipient = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="received_massages"
    )
    massage = models.TextField()
    post_date = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)


class DiaryNote(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="diary_notes"
    )
    add_date = models.DateTimeField(auto_now_add=True)
    visible = models.BooleanField(default=False)
    event_details = models.TextField(blank=True)
    event_details_tags = models.TextField(blank=True)
    thoughts_analysis = models.TextField(blank=True)
    thoughts_analysis_tags = models.TextField(blank=True)
    emotion_type = models.TextField(blank=True)
    emotion_type_tags = models.TextField(blank=True)
    physical_sensations = models.TextField(blank=True)
    physical_sensations_tags = models.TextField(blank=True)
    primary_emotion = models.CharField(
        max_length=50, choices=PRIMARY_EMOTIONS, blank=True
    )
    clarifying_emotion = ArrayField(
        models.CharField(max_length=50, choices=CLARIFYING_EMOTIONS), blank=True
    )

    class Meta:
        ordering = ["-add_date"]
