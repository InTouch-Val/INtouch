# Generated by Django 4.2.6 on 2024-05-13 10:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0018_alter_assignmentclient_visible"),
    ]

    operations = [
        migrations.AlterField(
            model_name="diarynote",
            name="author",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="diary_notes",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="diarynote",
            name="visible",
            field=models.BooleanField(default=False),
        ),
    ]