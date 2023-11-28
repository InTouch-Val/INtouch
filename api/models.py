from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    date_of_birth = models.DateField(null=True)
    last_update = models.DateTimeField(auto_now=True)
    add_date = models.DateTimeField(auto_now_add=True)
    user_type = models.CharField(max_length=100)
    accept_policy = models.BooleanField(default=False)
    photo = models.ImageField(
        upload_to='user_photos',
        default='user_photos/default_user_photo.jpg',
        blank=True,
    )

    def __str__(self):
        return self.username


class Doctor(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE)
    clients = models.ManyToManyField(
        'User',
        # through='ClientRelationship',
        # symmetrical=False,
        blank=True,
        related_name='clients'
    )
    assignments = models.ManyToManyField('Assignment', blank=True)


class Client(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE)
    assignments = models.ManyToManyField('AssignmentClient', blank=True)
    diagnosis = models.CharField(max_length=255, blank=True)
    about = models.TextField(blank=True)


# class ClientRelationship(models.Model):
#     from_user = models.ForeignKey(User, related_name='from_users', on_delete=models.CASCADE)
#     to_user = models.ForeignKey(User, related_name='to_users', on_delete=models.CASCADE)


class Assignment(models.Model):
    title = models.CharField(max_length=100)
    text = models.TextField()
    update_date = models.DateField(auto_now=True)
    add_date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    assignment_type = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    tags = models.CharField(max_length=255)
    language = models.CharField(max_length=100)
    share = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    image_url = models.CharField(max_length=255)
    blocks = models.ManyToManyField('Block', related_name='blocks', blank=True)
    comments = models.ManyToManyField('Comment', blank=True)

    def like(self):
        self.likes += 1
        self.save()

    def dislike(self):
        if self.likes > 0:
            self.likes -= 1
            self.save()

    def __str__(self):
        return self.title


class AssignmentClient(models.Model):
    title = models.CharField(max_length=100)
    text = models.TextField()
    update_date = models.DateField(auto_now=True)
    add_date = models.DateTimeField(auto_now_add=True)
    assignment_type = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    tags = models.CharField(max_length=255)
    language = models.CharField(max_length=100)
    share = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    image_url = models.CharField(max_length=255)
    blocks = models.ManyToManyField('Block', related_name='blocks_client', blank=True)
    comments = models.ManyToManyField('Comment', blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Block(models.Model):
    question = models.CharField(max_length=250)
    type = models.CharField(max_length=100)
    reply = models.TextField(blank=True)
    choice_replies = models.ManyToManyField('BlockChoice', blank=True, related_name='block_choices')
    start_range = models.IntegerField(blank=True, null=True)
    end_range = models.IntegerField(blank=True, null=True)


class BlockChoice(models.Model):
    block = models.ForeignKey('Block', on_delete=models.CASCADE)
    reply = models.CharField(max_length=100)
    checked = models.BooleanField(default=False)


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
