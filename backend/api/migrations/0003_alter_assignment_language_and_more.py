# Generated by Django 4.2.6 on 2024-03-28 11:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_alter_assignment_grades"),
    ]

    operations = [
        migrations.AlterField(
            model_name="assignment",
            name="language",
            field=models.CharField(
                choices=[
                    ("fr", "French"),
                    ("en", "English"),
                    ("es", "Spanish"),
                    ("de", "German"),
                    ("it", "Italian"),
                ],
                max_length=100,
            ),
        ),
        migrations.AlterField(
            model_name="assignmentclient",
            name="language",
            field=models.CharField(
                choices=[
                    ("fr", "French"),
                    ("en", "English"),
                    ("es", "Spanish"),
                    ("de", "German"),
                    ("it", "Italian"),
                ],
                max_length=100,
            ),
        ),
    ]
