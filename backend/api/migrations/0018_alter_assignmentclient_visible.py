# Generated by Django 4.2.6 on 2024-05-09 07:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0017_alter_assignmentclient_options_alter_block_options_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="assignmentclient",
            name="visible",
            field=models.BooleanField(default=False),
        ),
    ]
