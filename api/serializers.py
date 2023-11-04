from django.contrib.auth import authenticate
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.core.validators import RegexValidator
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from main.models import *


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
            'accept_policy'
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


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'


class MassageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Massage
        fields = '__all__'


class EmailLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(username=email, password=password)
        if user:
            if not user.is_active:
                raise serializers.ValidationError('User is not active')
        else:
            raise serializers.ValidationError('Incorrect email or password')
        attrs['user'] = user
        return attrs


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


class AddClientSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    def validate(self, attrs):
        first_name = attrs.get('first_name')
        last_name = attrs.get('last_name')
        email = attrs.get('email')
        return attrs


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
