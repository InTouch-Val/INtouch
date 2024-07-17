import uuid

from api.models import *
from drf_extra_fields.fields import Base64ImageField
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.template.loader import render_to_string
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from api.tasks import remove_unverified_user
from api.utils import current_site, send_by_mail
from api.constants import (
    TIME_DELETE_NON_ACTIVE_USER,
    USER_TYPES,
    DIARY_FIELDS_TO_CHECK,
    METRICS_DATE_FORMAT,
)


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
    client = serializers.SerializerMethodField()
    doctor = DoctorSerializer(
        required=False,
        read_only=True,
    )
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    user_type = serializers.CharField(read_only=True)
    photo = serializers.ImageField(required=False)
    new_email_changing = serializers.BooleanField(read_only=True)
    new_email_temp = serializers.EmailField(read_only=True)

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
            "new_email_changing",
            "new_email_temp",
        )
        extra_kwargs = {"is_active": {"read_only": True}}

    def get_client(self, obj):
        request = self.context.get("request")
        if (
            request
            and hasattr(request, "user")
            and request.user.is_authenticated
            and request.user.user_type != USER_TYPES[0]
        ):
            try:
                return ClientSerializer(obj.client).data
            except User.client.RelatedObjectDoesNotExist:
                return None
        else:
            return None

    def validate(self, attrs):
        if len(attrs["first_name"]) < 2 or len(attrs["last_name"]) < 2:
            raise serializers.ValidationError(
                "First and last names must be at least two-symbols words"
            )
        if len(attrs["first_name"]) > 50 or len(attrs["last_name"]) > 50:
            raise serializers.ValidationError(
                "First and last names cannot exceed 50 characters"
            )
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")
        if not attrs["accept_policy"]:
            raise serializers.ValidationError("Accept with company policy")
        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError(
                "This email address already exists. Please use a unique one."
            )
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
            user_type=USER_TYPES[1],
            is_active=False,
        )
        try:
            validate_password(password=validated_data["password"], user=user)
        except ValidationError as err:
            user.delete()
            raise serializers.ValidationError({"password": err.messages})
        Doctor.objects.create(user=user)
        token = default_token_generator.make_token(user)
        activation_url = f"/activate/{user.pk}/{token}/"
        html_message = render_to_string(
            "registration/confirm_mail.html",
            {"url": activation_url, "domen": current_site, "name": user.first_name},
        )
        send_by_mail(html_message, user.email)
        remove_unverified_user.send_with_options(
            args=(user.pk,), delay=TIME_DELETE_NON_ACTIVE_USER
        )
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
    new_password = serializers.CharField(write_only=True)
    confirm_new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        request = self.context.get("request")
        user = request.user
        if attrs["new_password"] != attrs["confirm_new_password"]:
            raise serializers.ValidationError("Passwords do not match")
        try:
            validate_password(password=attrs["new_password"], user=user)
        except ValidationError as err:
            raise serializers.ValidationError({"new_password": err.messages})
        return attrs


class UpdatePasswordSerializer(ChangePasswordSerializer):
    password = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        request = self.context.get("request")
        user = request.user
        if attrs["new_password"] != attrs["confirm_new_password"]:
            raise serializers.ValidationError("Passwords do not match")
        try:
            validate_password(password=attrs["new_password"], user=user)
        except ValidationError as err:
            raise serializers.ValidationError({"new_password": err.messages})
        return attrs


class UpdateEmailSerializer(serializers.Serializer):
    """Изменение эл. почты пользователя."""

    new_email = serializers.EmailField()

    def validate(self, attrs):
        request = self.context.get("request")
        user = request.user
        if attrs["new_email"] == user.email:
            raise serializers.ValidationError(
                "This email is already set on your account"
            )
        if User.objects.filter(email=attrs["new_email"]).exists():
            raise serializers.ValidationError("User with this email is already exists")
        return attrs


class UpdateUserSerializer(serializers.ModelSerializer):
    """Редактирование данных в профиле пользователя"""

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "date_of_birth", "photo"]

    # TODO: настроить валидацию при необязательном введении одного из полей
    # def validate(self, attrs):
    # if len(attrs["first_name"]) < 2 or len(attrs["last_name"]) < 2:
    # raise serializers.ValidationError(
    # "First and last names must be at least two-symbols words"
    # )
    # return attrs

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
        doctor = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            doctor = request.user
        user = User.objects.create(
            username=validated_data["email"],
            first_name=validated_data["first_name"].title(),
            last_name=validated_data["last_name"].title(),
            email=validated_data["email"],
            password=uuid.uuid4(),
            user_type=USER_TYPES[0],
            is_active=False,
        )
        Client.objects.create(user=user)
        token = default_token_generator.make_token(user)
        activation_url = f"/activate-client/{user.pk}/{token}/"
        html_message = render_to_string(
            "registration/client_invitation.html",
            {
                "url": activation_url,
                "domen": current_site,
                "name": user.first_name,
                "doctor_name": doctor.first_name,
                "doctor_lname": doctor.last_name,
            },
        )
        send_by_mail(html_message, user.email)
        remove_unverified_user.send_with_options(
            args=(user.pk,), delay=TIME_DELETE_NON_ACTIVE_USER
        )
        return user


class UpdateClientSerializer(serializers.ModelSerializer):
    """Завершение регистрации со стороны клиента, установка пароля"""

    password = serializers.CharField(write_only=True)
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
        try:
            validate_password(password=password, user=user)
        except ValidationError as err:
            raise serializers.ValidationError({"password": err.messages})
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


class BlockChoiceSerializerForClient(serializers.ModelSerializer):
    """Block choice serializer for updating values in AssignmentClient"""

    class Meta:
        model = BlockChoice
        fields = "__all__"
        read_only_fields = ["reply"]

    def update(self, instance, validated_data):
        instance.checked = validated_data.pop("checked", False)
        instance.save()
        return instance


class BlockChoiceSerializer(BlockChoiceSerializerForClient):

    class Meta:
        model = BlockChoice
        fields = "__all__"

    def create(self, validated_data):
        block_choice = BlockChoice.objects.create(**validated_data)
        return block_choice

    def update(self, instance, validated_data):
        instance.reply = validated_data.pop("reply")
        instance.checked = validated_data.pop("checked", False)
        instance.save()
        return instance


class BlockSerializerForClient(serializers.ModelSerializer):
    """Block serializer for updating values in AssignmentClient"""

    choice_replies = BlockChoiceSerializerForClient(many=True, required=False)
    left_pole = serializers.CharField(required=False)
    right_pole = serializers.CharField(required=False)
    image = Base64ImageField(read_only=True)

    class Meta:
        model = Block
        fields = "__all__"
        read_only_fields = [
            "question",
            "type",
            "start_range",
            "end_range",
        ]


class CustomBase64ImageField(Base64ImageField):
    """Custom Base64 to return https URLs in blocks."""

    def to_representation(self, file):
        request = self.context.get("request", None)
        url = super().to_representation(file)
        # Has to be hardcoded for now, can be changed to code below after gunicorn arrives
        # if request and request.is_secure():
        #     return request.build_absolute_uri(url).replace("http://", "https://")
        if request:
            return request.build_absolute_uri(url).replace("http://", "https://")
        return url


class BlockSerializer(BlockSerializerForClient):
    choice_replies = BlockChoiceSerializer(many=True, required=False)
    image = CustomBase64ImageField(default=None)

    class Meta:
        model = Block
        fields = "__all__"
        read_only_fields = [
            "reply",
        ]

    def create(self, validated_data):
        choice_replies_data = validated_data.pop("choice_replies", [])
        block = Block.objects.create(**validated_data)
        for choice_data in choice_replies_data:
            BlockChoiceSerializer.create(BlockChoiceSerializer(), choice_data)
        return block


class AssignmentSerializer(serializers.ModelSerializer):
    blocks = BlockSerializer(many=True, required=False)
    author_name = serializers.SerializerMethodField()
    status = serializers.CharField(required=False)
    tags = serializers.CharField(required=False)
    image_url = serializers.CharField(required=False)
    is_public = serializers.BooleanField(read_only=True)
    is_favorite = serializers.SerializerMethodField()
    average_grade = serializers.FloatField(read_only=True)

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
            "is_favorite",
            "average_grade",
        ]
        read_only_fields = [
            "id",
            "update_date",
            "add_date",
            "share",
            "author",
            "is_favorite",
            "average_grade",
        ]

    def get_author_name(self, obj) -> str:
        try:
            if obj.author.deleted:
                return USER_TYPES[2]
            return str(obj.author)
        except AttributeError:
            return USER_TYPES[2]

    def get_is_favorite(self, obj) -> bool:
        return (
            self.context["request"].user.doctor.assignments.filter(pk=obj.id).exists()
        )

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
        instance.is_public = validated_data.get("is_public", instance.is_public)
        instance.title = validated_data.get("title", instance.title)
        instance.text = validated_data.get("text", instance.text)
        instance.assignment_type = validated_data.get(
            "assignment_type", instance.assignment_type
        )
        instance.tags = validated_data.get("tags", instance.tags)
        instance.language = validated_data.get("language", instance.language)
        instance.image_url = validated_data.get("image_url", instance.image_url)
        if "blocks" not in validated_data:
            instance.save()
            return instance
        initial_blocks = instance.blocks.all()
        blocks_data = validated_data.pop("blocks", [])
        for block, data in zip(initial_blocks, blocks_data):
            choice_replies_data = data.pop("choice_replies", [])
            updated_block = BlockSerializerForClient.update(
                BlockSerializerForClient(),
                block,
                data,
            )
            choice_blocks = updated_block.choice_replies.all()
            for block, choice_data in zip(choice_blocks, choice_replies_data):
                BlockChoiceSerializer.update(
                    BlockChoiceSerializer(),
                    block,
                    choice_data,
                )
        instance.save()
        return instance


class AssignmentClientSerializer(serializers.ModelSerializer):
    blocks = BlockSerializerForClient(many=True, required=False)
    author_name = serializers.StringRelatedField(source="author", read_only=True)
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
            "author",
            "author_name",
            "user",
            "visible",
            "assignment_root",
        ]

    def validate_grade(self, data):
        if not 0 < data <= 10:
            raise serializers.ValidationError("Grade must be in range from 0 to 10!")
        return data

    def update(self, instance, validated_data):
        instance.status = "in progress"
        instance.grade = validated_data.get("grade", instance.grade)
        instance.review = validated_data.get("review", instance.review)
        if "blocks" not in validated_data:
            instance.save()
            return instance
        initial_blocks = instance.blocks.all()
        blocks_data = validated_data.pop("blocks", [])
        for block, data in zip(initial_blocks, blocks_data):
            choice_replies_data = data.pop("choice_replies", [])
            updated_block = BlockSerializerForClient.update(
                BlockSerializerForClient(),
                block,
                data,
            )
            choice_blocks = updated_block.choice_replies.all()
            for block, choice_data in zip(choice_blocks, choice_replies_data):
                BlockChoiceSerializerForClient.update(
                    BlockChoiceSerializerForClient(),
                    block,
                    choice_data,
                )
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
    author = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault()
    )
    author_name = serializers.StringRelatedField(source="author", read_only=True)

    class Meta:
        model = DiaryNote
        fields = "__all__"

    def validate(self, data):
        if not data:
            raise ValidationError("You can not create an empty diary note!")
        if all(text not in data.keys() for text in DIARY_FIELDS_TO_CHECK):
            raise ValidationError(
                "You can not create a diary note without text fields!"
            )
        if "clarifying_emotion" not in data.keys():
            data["clarifying_emotion"] = []
        return data

    def create(self, validated_data):
        author = self.context["request"].user
        diary_note = DiaryNote.objects.create(author=author, **validated_data)
        return diary_note


class BaseMetricsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    date_joined = serializers.DateTimeField(format=METRICS_DATE_FORMAT)
    rolling_retention_7d = serializers.BooleanField()
    rolling_retention_30d = serializers.BooleanField()
    last_login = serializers.DateTimeField(format=METRICS_DATE_FORMAT)
    deleted_on = serializers.DateTimeField(format=METRICS_DATE_FORMAT)


class TherapistsMetricsSerializer(BaseMetricsSerializer):
    clients_count = serializers.IntegerField()
    last_invited = serializers.DateTimeField(format=METRICS_DATE_FORMAT)
    last_sent_assignment = serializers.DateTimeField(format=METRICS_DATE_FORMAT)
    last_created_assignment = serializers.DateTimeField(format=METRICS_DATE_FORMAT)


class ClientsMetricsSerializer(BaseMetricsSerializer):
    last_done_assignment = serializers.DateTimeField(format=METRICS_DATE_FORMAT)
    last_created_diary = serializers.DateTimeField(format=METRICS_DATE_FORMAT)


class GrowthMetricsSerializer(serializers.Serializer):
    amount_of_therapists = serializers.IntegerField()
    amount_of_clients = serializers.IntegerField()
    amount_of_assignments = serializers.IntegerField()
    amount_of_deleted_therapists = serializers.IntegerField()
    amount_of_deleted_clients = serializers.IntegerField()
