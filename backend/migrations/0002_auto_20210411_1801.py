# Generated by Django 3.1.7 on 2021-04-11 18:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('backend', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='uploadrequest',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='recruitmentresult',
            name='recruitment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.recruitment'),
        ),
        migrations.AddField(
            model_name='recruitmentresult',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.candidate'),
        ),
        migrations.AddField(
            model_name='recruitmentresult',
            name='upload_request',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.uploadrequest'),
        ),
        migrations.AddField(
            model_name='recruitment',
            name='field_of_study',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.fieldofstudy'),
        ),
        migrations.AddField(
            model_name='recruitment',
            name='upload_request',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.uploadrequest'),
        ),
        migrations.AddField(
            model_name='payment',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.candidate'),
        ),
        migrations.AddField(
            model_name='payment',
            name='upload_request',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.uploadrequest'),
        ),
        migrations.AddField(
            model_name='graduatedschool',
            name='candidate',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.candidate'),
        ),
        migrations.AddField(
            model_name='graduatedschool',
            name='upload_request',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.uploadrequest'),
        ),
        migrations.AddField(
            model_name='grade',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.graduatedschool'),
        ),
        migrations.AddField(
            model_name='grade',
            name='upload_request',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.uploadrequest'),
        ),
        migrations.AddField(
            model_name='fieldofstudy',
            name='faculty',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.faculty'),
        ),
        migrations.AddField(
            model_name='fieldofstudy',
            name='upload_request',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.uploadrequest'),
        ),
        migrations.AddField(
            model_name='examresult',
            name='candidate',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.candidate'),
        ),
        migrations.AddField(
            model_name='examresult',
            name='upload_request',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.uploadrequest'),
        ),
        migrations.AddField(
            model_name='candidate',
            name='upload_request',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.uploadrequest'),
        ),
    ]
