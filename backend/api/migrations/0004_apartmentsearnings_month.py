# Generated by Django 5.1.7 on 2025-03-26 22:55

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_apartment_owner_apartmentsearnings_apartment_owner'),
    ]

    operations = [
        migrations.AddField(
            model_name='apartmentsearnings',
            name='month',
            field=models.DateField(default=datetime.date.today),
        ),
    ]
