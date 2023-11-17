import uuid

from django.contrib.auth import authenticate
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.core.validators import RegexValidator
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import *


class UserSerializer(serializers.ModelSerializer):
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
        fields = (
            'id',
            'first_name',
            'last_name',
            'email',
            'password',
            'confirm_password',
            'accept_policy',
            'birth_date',
            'date_joined',
            'update_date',
            'assignments',
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
            is_active=False,
        )
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
        PasswordResetForm(data={'email': value}).is_valid()
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

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        return attrs


class AddClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'doctor_id']

    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    doctor_id = serializers.IntegerField()

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=uuid.uuid4(),
            accept_policy=True,
            is_active=False,
        )
        token = default_token_generator.make_token(user)
        activation_url = f'/api/v1/confirm-email/{user.pk}/{token}/'
        current_site = 'http://127.0.0.1:8000'
        html_message = render_to_string(
            'registration/confirm_mail.html',
            {'url': activation_url, 'domen': current_site}
        )
        message = strip_tags(html_message)
        mail = EmailMultiAlternatives(
            'Подтвердите свой электронный адрес',
            message,
            'iw.sitnikoff@yandex.ru',
            [user.email],
        )
        mail.attach_alternative(html_message, 'text/html')
        mail.send()
        return user


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'


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
    class Meta:
        model = Assignment
        fields = '__all__'


class AddBlockChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockChoice
        fields = ['reply']

    def create(self, validated_data):
        block_choice = BlockChoice.objects.create(**validated_data)
        block_choice.block = validated_data['block']
        block_choice.save()
        return block_choice


class AddBlockSerializer(serializers.ModelSerializer):
    choice_replies = AddBlockChoiceSerializer(many=True, required=False)
    class Meta:
        model = Block
        fields = ['question', 'type', 'choice_replies']

    def create(self, validated_data):
        choice_replies_data = validated_data.pop('choice_replies', [])
        block = Block.objects.create(**validated_data)
        for choice_data in choice_replies_data:
            choice_data['block'] = block
            AddBlockChoiceSerializer.create(
                AddBlockChoiceSerializer(),
                choice_data
            )
        block.assignment = validated_data['assignment']
        block.save()
        return block


class AddAssignmentSerializer(serializers.ModelSerializer):
    blocks = AddBlockSerializer(many=True, required=False)
    tags = serializers.CharField(required=False)
    class Meta:
        model = Assignment
        fields = [
            'title',
            'text',
            'assignment_type',
            'tags',
            'language',
            'blocks'
        ]

    def create(self, validated_data):
        blocks_data = validated_data.pop('blocks', [])
        assignment = Assignment.objects.create(**validated_data)
        for block_data in blocks_data:
            block_data['assignment'] = assignment
            choice_replies_data = block_data.pop('choice_replies', [])
            block = AddBlockSerializer.create(AddBlockSerializer(), block_data)
            for choice_data in choice_replies_data:
                choice_data['block'] = block
                block_choice = AddBlockChoiceSerializer.create(
                    AddBlockChoiceSerializer(),
                    choice_data
                )
                block.choice_replies.add(block_choice)
            assignment.blocks.add(block)
        return assignment
