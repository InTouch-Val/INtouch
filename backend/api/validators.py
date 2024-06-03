import re

from django.core.exceptions import ValidationError


class MaximumLengthValidator:
    def __init__(self, max_length=128):
        self.max_length = max_length

    def validate(self, password, user=None):
        if len(password) > self.max_length:
            raise ValidationError("This password cannot exceed 128 characters.")

    def get_help_text(self):
        return "Your password cannot exceed 128 characters."


class LatinLettersValidator:
    def validate(self, password, user=None):
        if re.search(r"[а-яёА-ЯЁ]", password):
            raise ValidationError(
                "Your password can only contain Latin letters, "
                "Arabic numerals, and the following special characters: "
                "~ ! ? @ # $ % ^ & * _ - + ( ) [ ] { } > < / | ' . , : ;"
            )

    def get_help_text(self):
        return (
            "Your password can only contain Latin letters, "
            "Arabic numerals, and the following special characters: "
            "~ ! ? @ # $ % ^ & * _ - + ( ) [ ] { } > < / | ' . , : ;"
        )


class NoSpaceValidator:
    def validate(self, password, user=None):
        if re.search(r"(\s+)", password):
            raise ValidationError("Spaces are not allowed in your password.")

    def get_help_text(self):
        return "Spaces are not allowed in your password."
