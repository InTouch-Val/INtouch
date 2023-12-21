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
        return f'{self.first_name} {self.last_name}'


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
    notes = models.ManyToManyField('Note', blank=True)


# class ClientRelationship(models.Model):
#     from_user = models.ForeignKey(User, related_name='from_users', on_delete=models.CASCADE)
#     to_user = models.ForeignKey(User, related_name='to_users', on_delete=models.CASCADE)


class Assignment(models.Model):
    title = models.CharField(max_length=100)
    text = models.TextField()
    update_date = models.DateField(auto_now=True)
    add_date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='assignments',
        null=True,
    )
    assignment_type = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    tags = models.CharField(max_length=255)
    language = models.CharField(max_length=100)
    share = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    image_url = models.CharField(max_length=255)
    blocks = models.ManyToManyField(
        'Block',
        related_name='assignment',
        blank=True
    )
    comments = models.ManyToManyField('Comment', blank=True)
    is_public = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class AssignmentClient(models.Model):
    title = models.CharField(max_length=100)
    text = models.TextField()
    update_date = models.DateField(auto_now=True)
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='assignments_clients',
        null=True,
    )
    add_date = models.DateTimeField(auto_now_add=True)
    assignment_type = models.CharField(max_length=100)
    status = models.CharField(max_length=100, default='to do')
    tags = models.CharField(max_length=255)
    language = models.CharField(max_length=100)
    share = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    image_url = models.CharField(max_length=255)
    blocks = models.ManyToManyField(
        'Block',
        related_name='assignment_client',
        blank=True
    )
    comments = models.ManyToManyField('Comment', blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    visible = models.BooleanField(default=True)


class Block(models.Model):
    question = models.CharField(max_length=250)
    reply = models.TextField(blank=True)
    type = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    choice_replies = models.ManyToManyField(
        'BlockChoice',
        blank=True
    )
    start_range = models.IntegerField(default=1)
    end_range = models.IntegerField(default=10)
    left_pole = models.CharField(max_length=50)
    right_pole = models.CharField(max_length=50)
    image = models.ImageField(
        upload_to='block_images',
        blank=True,
    )


class BlockChoice(models.Model):
    reply = models.CharField(max_length=100)
    checked = models.BooleanField(default=False)


class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    add_date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='notes',
        null=True,
    )


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
