# Generated by Django 4.2.6 on 2024-06-12 11:03

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0021_rename_date_daleted_user_date_deleted"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="date_deleted",
            field=models.DateTimeField(null=True),
        ),
    ]
