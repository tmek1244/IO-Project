# Generated by Django 3.1.7 on 2021-05-02 00:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_auto_20210501_2306'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidate',
            name='contest',
            field=models.CharField(blank=True, max_length=80, null=True),
        ),
        migrations.AlterField(
            model_name='fieldofstudy',
            name='degree',
            field=models.CharField(blank=True, choices=[('1', 'Bachelor'), ('2', 'Master')], default='1', max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='fieldofstudy',
            name='type',
            field=models.CharField(blank=True, default='stacjonarne', max_length=100, null=True),
        ),
    ]