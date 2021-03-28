from typing import Any, Dict

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.db.models.base import Model
from django.utils.crypto import get_random_string
from rest_framework import serializers

from django.core.exceptions import ValidationError


class UserSerializer(serializers.ModelSerializer[Any]):
    class Meta:
        model = get_user_model()
        fields = ('first_name', 'last_name', 'email', 'faculty', 'is_staff')

    def create(self, validated_data: Dict[Any, Any]) -> Model:
        user = get_user_model().objects.create(
            username=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            faculty=validated_data['faculty'],
            is_staff=validated_data['is_staff']
        )
        password = get_random_string(length=8)
        user.set_password(password)

        user.save()

        # until final release check tmp/email-messages/ to see emails
        send_mail(
            subject="Rejestracja na CHAŁKA",
            message=f"""Witaj,\n
            Dodano Cię do bazy użytkowników CHAŁKA, z następującymi danymi:
                imię: {validated_data['first_name']}
                nazwisko: {validated_data['last_name']}
                email: {validated_data['email']}
                HASŁO: {password}\n
            Pozdrawiamy :)
            """,
            from_email="no-reply@nie.wiem",
            recipient_list=[validated_data['email']],
            fail_silently=False
        )

        return user
