# Generated by Django 3.1.7 on 2021-04-17 01:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_merge_20210417_0155'),
    ]

    operations = [
        migrations.AlterField(
            model_name='faculty',
            name='name',
            field=models.CharField(max_length=150),
        ),
    ]
