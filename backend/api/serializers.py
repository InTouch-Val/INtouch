import uuid

from api.models import *
from django.contrib.auth.tokens import default_token_generator
from django.core.validators import RegexValidator
from django.template.loader import render_to_string
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .tasks import remove_unverified_user
from .utils import current_site, send_by_mail


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            "id",
            "diagnosis",
            "about",
            "assignments",
            "notes",
        ]


class ClientInDoctorSerializers(serializers.ModelSerializer):
    """Сериализатор для наглядного описания клиента в модели доктора(clients)"""

    client = ClientSerializer()

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "date_joined",
            "is_active",
            "photo",
            "date_of_birth",
            "last_update",
            "client",
        ]


class DoctorSerializer(serializers.ModelSerializer):
    clients = ClientInDoctorSerializers(many=True)

    class Meta:
        model = Doctor
        fields = [
            "id",
            "clients",
            "assignments",
        ]


class UserSerializer(serializers.ModelSerializer):
    client = ClientSerializer(required=False)
    doctor = DoctorSerializer(required=False)
    password = serializers.CharField(
        write_only=True,
        validators=[
            RegexValidator(
                regex=r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$",
                message="The password must contain at least 8 characters, "
                "including letters and numbers.",
            )
        ],
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
            "id",
            "first_name",
            "last_name",
            "email",
            "password",
            "confirm_password",
            "accept_policy",
            "date_of_birth",
            "date_joined",
            "last_update",
            "client",
            "doctor",
            "user_type",
            "is_active",
            "photo",
        )

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")
        if not attrs["accept_policy"]:
            raise serializers.ValidationError("Accept with company policy")
        return attrs

    def create(self, validated_data):
        """Используется при создании пользователя-доктора"""
        user = User.objects.create_user(
            username=validated_data["email"],
            first_name=validated_data["first_name"].title(),
            last_name=validated_data["last_name"].title(),
            email=validated_data["email"],
            password=validated_data["password"],
            accept_policy=validated_data["accept_policy"],
            user_type="doctor",
            is_active=False,
        )
        Doctor.objects.create(user=user)
        token = default_token_generator.make_token(user)
        activation_url = f"/activate/{user.pk}/{token}/"
        html_message = render_to_string(
            "registration/confirm_mail.html",
            {"url": activation_url, "domen": current_site, "name": user.first_name},
        )
        send_by_mail(html_message, user.email)
        remove_unverified_user.send_with_options(args=(user.pk,), delay=259200000)
        return user


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return value

    def create(self, validated_data):
        email = validated_data["email"]
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        url = f"/reset-password/{user.pk}/{token}/"
        html_message = render_to_string(
            "registration/password_reset.html",
            {"url": url, "domen": current_site, "name": user.first_name},
        )
        send_by_mail(html_message, user.email)
        return {"message": "Password reset email sent."}


class ChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(
        write_only=True,
        validators=[
            RegexValidator(
                regex=r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$",
                message=(
                    "The password must contain at least 8 characters, "
                    "including letters and numbers."
                ),
            )
        ],
    )
    confirm_new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_new_password"]:
            raise serializers.ValidationError("Passwords do not match")
        return attrs


class UpdatePasswordSerializer(ChangePasswordSerializer):
    password = serializers.CharField()

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_new_password"]:
            raise serializers.ValidationError("Passwords do not match")
        return attrs


class UpdateUserSerializer(serializers.ModelSerializer):
    """Редактирование данных в профиле пользователя"""

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "date_of_birth", "photo"]

    def update(self, user, validated_data):
        user.first_name = validated_data.get("first_name", user.first_name)
        user.last_name = validated_data.get("last_name", user.last_name)
        user.email = validated_data.get("email", user.email)
        user.username = user.email
        user.date_of_birth = validated_data.get("date_of_birth", user.date_of_birth)
        user.photo = validated_data.get("photo", user.photo)
        user.save()
        return user


class AddClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email"]

    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    def create(self, validated_data):
        """Создание пользователя-клиента"""
        user = User.objects.create(
            username=validated_data["email"],
            first_name=validated_data["first_name"].title(),
            last_name=validated_data["last_name"].title(),
            email=validated_data["email"],
            password=uuid.uuid4(),
            user_type="client",
            is_active=False,
        )
        Client.objects.create(user=user)
        token = default_token_generator.make_token(user)
        activation_url = f"/activate-client/{user.pk}/{token}/"
        html_message = render_to_string(
            "registration/confirm_mail_client.html",
            {"url": activation_url, "domen": current_site, "name": user.first_name},
        )
        send_by_mail(html_message, user.email)
        remove_unverified_user.send_with_options(args=(user.pk,), delay=259200000)
        return user


class UpdateClientSerializer(serializers.ModelSerializer):
    """Завершение регистрации со стороны клиента, установка пароля"""

    password = serializers.CharField(
        write_only=True,
        validators=[
            RegexValidator(
                regex=r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$",
                message="The password must contain at least 8 characters, "
                "including letters and numbers.",
            )
        ],
    )
    confirm_password = serializers.CharField(write_only=True)
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "email",
            "password",
            "confirm_password",
            "accept_policy",
        ]

    def update(self, user, validated_data):
        password = validated_data.get("password")
        confirm_password = validated_data.get("confirm_password")
        if password and confirm_password and password == confirm_password:
            user.first_name = validated_data["first_name"]
            user.last_name = validated_data["last_name"]
            user.email = validated_data["email"]
            user.accept_policy = validated_data["accept_policy"]
            user.set_password(password)
            user.save()
        return user


class DoctorUpdateClientSerializer(serializers.ModelSerializer):
    """Дает возможность доктору редактировать данные своего клиента"""

    client = ClientSerializer()

    class Meta:
        model = User
        fields = [
            "date_of_birth",
            "client",
        ]

    def update(self, user, validated_data):
        user.date_of_birth = validated_data["date_of_birth"]
        user.client.diagnosis = validated_data["client"]["diagnosis"]
        user.client.about = validated_data["client"]["about"]
        user.client.save()
        user.save()
        return user


class BlockChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockChoice
        fields = "__all__"

    def create(self, validated_data):
        block_choice = BlockChoice.objects.create(**validated_data)
        return block_choice

    def update(self, instance, validated_data):
        instance.reply = validated_data["reply"]
        instance.checked = validated_data.pop("checked", False)
        instance.save()
        return instance


class BlockSerializer(serializers.ModelSerializer):
    choice_replies = BlockChoiceSerializer(many=True, required=False)
    left_pole = serializers.CharField(required=False)
    right_pole = serializers.CharField(required=False)
    image = serializers.ImageField(required=False)

    class Meta:
        model = Block
        fields = "__all__"

    def create(self, validated_data):
        choice_replies_data = validated_data.pop("choice_replies", [])
        block = Block.objects.create(**validated_data)
        for choice_data in choice_replies_data:
            BlockChoiceSerializer.create(BlockChoiceSerializer(), choice_data)
        return block


class AssignmentSerializer(serializers.ModelSerializer):
    blocks = BlockSerializer(many=True, required=False)
    author_name = serializers.StringRelatedField(source="author", read_only=True)
    status = serializers.CharField(required=False)
    tags = serializers.CharField(required=False)
    image_url = serializers.CharField(required=False)
    is_public = serializers.BooleanField(read_only=True)
    avarage_grade = serializers.SerializerMethodField(method_name="get_avarage_grade")

    class Meta:
        model = Assignment
        fields = [
            "id",
            "title",
            "text",
            "update_date",
            "add_date",
            "assignment_type",
            "status",
            "tags",
            "language",
            "share",
            "image_url",
            "blocks",
            "author",
            "author_name",
            "is_public",
            "avarage_grade",
        ]

    def get_avarage_grade(self, instance):
        return sum(instance.grades) / len(instance.grades)

    def create(self, validated_data):
        blocks_data = validated_data.pop("blocks", [])
        user = self.context["request"].user
        assignment = Assignment.objects.create(author=user, **validated_data)
        user.doctor.assignments.add(assignment)
        for block_data in blocks_data:
            choice_replies_data = block_data.pop("choice_replies", [])
            block = BlockSerializer.create(BlockSerializer(), block_data)
            for choice_data in choice_replies_data:
                block_choice = BlockChoiceSerializer.create(
                    BlockChoiceSerializer(), choice_data
                )
                block.choice_replies.add(block_choice)
            assignment.blocks.add(block)
        return assignment

    def update(self, instance, validated_data):
        instance.is_public = True
        instance.title = validated_data["title"]
        instance.text = validated_data["text"]
        instance.assignment_type = validated_data["assignment_type"]
        instance.tags = validated_data["tags"]
        instance.language = validated_data["language"]
        instance.image_url = validated_data["image_url"]
        blocks = instance.blocks.all()
        for block in blocks:
            block.delete()
        blocks_data = validated_data.pop("blocks", [])
        for block_data in blocks_data:
            choice_replies_data = block_data.pop("choice_replies", [])
            block = BlockSerializer.create(BlockSerializer(), block_data)
            for choice_data in choice_replies_data:
                block_choice = BlockChoiceSerializer.create(
                    BlockChoiceSerializer(), choice_data
                )
                block.choice_replies.add(block_choice)
            instance.blocks.add(block)
        instance.save()
        return instance


class AssignmentClientSerializer(serializers.ModelSerializer):
    blocks = BlockSerializer(many=True, required=False)
    author_name = serializers.StringRelatedField(source="author", read_only=True)
    grade = serializers.IntegerField(required=False)
    review = serializers.CharField(required=False)
    assignment_root = serializers.PrimaryKeyRelatedField(read_only=True)
    visible = serializers.BooleanField(read_only=True)

    class Meta:
        model = AssignmentClient
        fields = [
            "id",
            "title",
            "text",
            "update_date",
            "add_date",
            "assignment_type",
            "status",
            "tags",
            "language",
            "share",
            "image_url",
            "blocks",
            "author",
            "author_name",
            "user",
            "visible",
            "grade",
            "review",
            "assignment_root",
        ]
        read_only_fields = [
            "user",
            "language",
            "tags",
            "assignment_type",
            "text",
            "title",
            "image_url",
        ]

    def update(self, instance, validated_data):
        instance.status = "in progress"
        grade = validated_data.get("grade")
        if grade and instance.grade is None:
            instance.grade = grade
            instance.review = validated_data.get("review", "")
            instance.assignment_root.grades.append(grade)
            instance.assignment_root.save()
        blocks = instance.blocks.all()
        for block in blocks:
            block.delete()
        blocks_data = validated_data.pop("blocks", [])
        for block_data in blocks_data:
            choice_replies_data = block_data.pop("choice_replies", [])
            block = BlockSerializer.create(
                BlockSerializer(),
                block_data,
            )
            for choice_data in choice_replies_data:
                block_choice = BlockChoiceSerializer.create(
                    BlockChoiceSerializer(),
                    choice_data,
                )
                block.choice_replies.add(block_choice)
            instance.blocks.add(block)
        instance.save()
        return instance


class NoteSerializer(serializers.ModelSerializer):
    author_name = serializers.StringRelatedField(source="author", read_only=True)
    client_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "content",
            "add_date",
            "author",
            "author_name",
            "client_id",
        ]

    def create(self, validated_data):
        author = self.context["request"].user
        client_id = validated_data.pop("client_id")
        note = Note.objects.create(author=author, **validated_data)
        client = User.objects.get(pk=client_id)
        client.client.notes.add(note)
        return note


class DiaryNoteSerializer(serializers.ModelSerializer):
    clarifying_emotion = serializers.ListField(
        child=serializers.CharField(max_length=50)
    )
    author = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault()
    )
    author_name = serializers.StringRelatedField(source="author", read_only=True)

    class Meta:
        model = DiaryNote
        fields = [
            "id",
            "author",
            "author_name",
            "add_date",
            "visible",
            "event_details",
            "thoughts_analysis",
            "physical_sensations",
            "primary_emotion",
            "clarifying_emotion",
        ]

    def create(self, validated_data):
        author = self.context["request"].user
        diary_note = DiaryNote.objects.create(author=author, **validated_data)
        return diary_note
