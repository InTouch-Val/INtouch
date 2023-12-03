import uuid

from django.contrib.auth import authenticate
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.hashers import check_password
from django.core.mail import EmailMultiAlternatives
from django.core.validators import RegexValidator
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.tokens import AccessToken

from .models import *


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            'id',
            'diagnosis',
            'about',
            'assignments',
        ]


class ClientInDoctorSerializers(serializers.ModelSerializer):
    client = ClientSerializer()
    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'date_joined',
            'is_active',
            'photo',
            'date_of_birth',
            'last_update',
            'client'
        ]


class DoctorSerializer(serializers.ModelSerializer):
    clients = ClientInDoctorSerializers(many=True)
    class Meta:
        model = Doctor
        fields = [
            'id',
            'clients',
            'assignments',
        ]


class UserSerializer(serializers.ModelSerializer):
    client = ClientSerializer(required=False)
    doctor = DoctorSerializer(required=False)
    password = serializers.CharField(
        write_only=True,
        validators=[
            RegexValidator(
                regex='^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$',
                message='The password must contain at least 8 characters, '
                        'including letters and numbers.'
            )
        ]
    )
    confirm_password = serializers.CharField(write_only=True)
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    user_type = serializers.CharField(read_only=True)
    photo = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'last_name',
            'email',
            'password',
            'confirm_password',
            'accept_policy',
            'date_of_birth',
            'date_joined',
            'last_update',
            'client',
            'doctor',
            'user_type',
            'photo',
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        if not attrs['accept_policy']:
            raise serializers.ValidationError("Accept with company policy")
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            accept_policy=validated_data['accept_policy'],
            user_type='doctor',
            is_active=False,
        )
        Doctor.objects.create(user=user)
        token = default_token_generator.make_token(user)
        activation_url = f'/activate/{user.pk}/{token}/'
        current_site = 'http://127.0.0.1:3000'
        html_message = render_to_string(
            'registration/confirm_mail.html',
            {'url': activation_url, 'domen': current_site, 'name': user.first_name}
        )
        message = strip_tags(html_message)
        mail = EmailMultiAlternatives(
            'Confirmation of Your Account Registration on INtouch',
            message,
            'iw.sitnikoff@yandex.ru',
            [user.email],
        )
        mail.attach_alternative(html_message, 'text/html')
        mail.send()
        return user


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(
        write_only=True,
        validators=[
            RegexValidator(
                regex='^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$',
                message='The password must contain at least 8 characters, '
                        'including letters and numbers.'
            )
        ]
    )
    confirm_new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_new_password']:
            raise serializers.ValidationError("Passwords do not match")
        return attrs


class UpdatePasswordSerializer(ChangePasswordSerializer):
    password = serializers.CharField()
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_new_password']:
            raise serializers.ValidationError("Passwords do not match")
        return attrs



class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'date_of_birth', 'photo']

    def update(self, user, validated_data):
        user.first_name = validated_data.get('first_name', user.first_name)
        user.last_name = validated_data.get('last_name', user.last_name)
        user.email = validated_data.get('email', user.email)
        user.date_of_birth = validated_data.get('date_of_birth', user.date_of_birth)
        user.photo = validated_data.get('photo', user.photo)
        user.save()
        return user


class AddClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=uuid.uuid4(),
            user_type='client',
            is_active=False,
        )
        Client.objects.create(user=user)
        token = default_token_generator.make_token(user)
        activation_url = f'/activate-client/{user.pk}/{token}/'
        current_site = 'http://127.0.0.1:3000'
        html_message = render_to_string(
            'registration/confirm_mail_client.html',
            {'url': activation_url, 'domen': current_site,
             'name': user.first_name}
        )
        message = strip_tags(html_message)
        mail = EmailMultiAlternatives(
            'Confirmation of Your Account Registration on INtouch',
            message,
            'iw.sitnikoff@yandex.ru',
            [user.email],
        )
        mail.attach_alternative(html_message, 'text/html')
        mail.send()
        return user


class UpdateClientSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[
            RegexValidator(
                regex='^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$',
                message='The password must contain at least 8 characters, '
                        'including letters and numbers.'
            )
        ]
    )
    confirm_password = serializers.CharField(write_only=True)
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'password',
            'confirm_password',
            'accept_policy'
        ]

    def update(self, user, validated_data):
        password = validated_data.get('password')
        confirm_password = validated_data.get('confirm_password')
        if password and confirm_password and password == confirm_password:
            user.first_name = validated_data['first_name']
            user.last_name = validated_data['last_name']
            user.email = validated_data['email']
            user.accept_policy = validated_data['accept_policy']
            user.set_password(password)
            user.save()
        return user


class DoctorUpdateClientSerializer(serializers.ModelSerializer):
    client = ClientSerializer()
    class Meta:
        model = User
        fields = [
            'date_of_birth',
            'client',
        ]

    def update(self, user, validated_data):
        user.date_of_birth = validated_data['date_of_birth']
        user.client.diagnosis = validated_data['client']['diagnosis']
        user.client.about = validated_data['client']['about']
        user.client.save()
        user.save()
        return user


class BlockChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockChoice
        fields = '__all__'


class BlockSerializer(serializers.ModelSerializer):
    choice_replies = BlockChoiceSerializer(many=True, required=False)
    class Meta:
        model = Block
        fields = '__all__'


class AssignmentSerializer(serializers.ModelSerializer):
    blocks = BlockSerializer(many=True, required=False)
    author = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    author_name = serializers.StringRelatedField(source='author', read_only=True)
    class Meta:
        model = Assignment
        fields = [
            'id',
            'title',
            'text',
            'update_date',
            'add_date',
            'assignment_type',
            'status',
            'tags',
            'language',
            'share',
            'image_url',
            'blocks',
            'author',
            'author_name'
        ]


class AssignmentClientSerializer(serializers.ModelSerializer):
    blocks = BlockSerializer(many=True, required=False)
    author = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    author_name = serializers.StringRelatedField(source='author', read_only=True)
    class Meta:
        model = AssignmentClient
        fields = [
            'id',
            'title',
            'text',
            'update_date',
            'add_date',
            'assignment_type',
            'status',
            'tags',
            'language',
            'share',
            'image_url',
            'blocks',
            'author',
            'author_name',
            'user',
        ]


class AddBlockChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockChoice
        fields = ['reply']

    def create(self, validated_data):
        block_choice = BlockChoice.objects.create(**validated_data)
        return block_choice


class AddBlockSerializer(serializers.ModelSerializer):
    choice_replies = AddBlockChoiceSerializer(many=True, required=False)
    start_range = serializers.IntegerField(required=False)
    end_range = serializers.IntegerField(required=False)
    class Meta:
        model = Block
        fields = [
            'question',
            'type',
            'choice_replies',
            'start_range',
            'end_range'
        ]

    def create(self, validated_data):
        choice_replies_data = validated_data.pop('choice_replies', [])
        block = Block.objects.create(**validated_data)
        for choice_data in choice_replies_data:
            AddBlockChoiceSerializer.create(
                AddBlockChoiceSerializer(),
                choice_data
            )
        return block


class AddAssignmentSerializer(serializers.ModelSerializer):
    blocks = AddBlockSerializer(many=True, required=False)
    tags = serializers.CharField(required=False)
    image_url = serializers.CharField(required=False)
    class Meta:
        model = Assignment
        fields = [
            'title',
            'text',
            'assignment_type',
            'tags',
            'language',
            'image_url',
            'blocks'
        ]

    def create(self, validated_data):
        blocks_data = validated_data.pop('blocks', [])
        token = self.context['request'].headers.get('Authorization').split(' ')[1]
        user = User.objects.get(pk=AccessToken(token)['user_id'])
        assignment = Assignment.objects.create(author=user, **validated_data)
        user.doctor.assignments.add(assignment)
        for block_data in blocks_data:
            choice_replies_data = block_data.pop('choice_replies', [])
            block = AddBlockSerializer.create(AddBlockSerializer(), block_data)
            for choice_data in choice_replies_data:
                block_choice = AddBlockChoiceSerializer.create(
                    AddBlockChoiceSerializer(),
                    choice_data
                )
                block.choice_replies.add(block_choice)
            assignment.blocks.add(block)
        return assignment
