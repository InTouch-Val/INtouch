# Generated by Django 4.2.6 on 2024-05-07 19:52

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0016_alter_blockchoice_options"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="assignmentclient",
            options={"ordering": ["-add_date"]},
        ),
        migrations.AlterModelOptions(
            name="block",
            options={"ordering": ["pk"]},
        ),
        migrations.AlterModelOptions(
            name="diarynote",
            options={"ordering": ["-add_date"]},
        ),
        migrations.AlterField(
            model_name="assignmentclient",
            name="review",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="doctor",
            name="clients",
            field=models.ManyToManyField(
                blank=True, related_name="doctors", to=settings.AUTH_USER_MODEL
            ),
        ),
    ]
