from typing import Any, Dict, List, TypeVar

from django.contrib.auth import get_user_model
# from django.core.mail import send_mail
from django.db.models.base import Model
from django.utils.crypto import get_random_string
from rest_framework import serializers
from rest_framework.serializers import CharField, Serializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.state import User
from rest_framework_simplejwt.tokens import RefreshToken

T = TypeVar('T')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs: List[str]) -> Any:
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        data['username'] = self.user.username
        data['email'] = self.user.email
        data['is_active'] = self.user.is_active
        data['is_staff'] = self.user.is_staff
        data['is_superuser'] = self.user.is_superuser
        return data

    @classmethod
    def get_token(cls, user: User) -> RefreshToken:
        token = super(CustomTokenObtainPairSerializer, cls).get_token(user)

        token['username'] = user.username
        token['email'] = user.email
        token['is_active'] = user.is_active
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        return token


class UserSerializer(serializers.ModelSerializer[Any]):
    class Meta:
        model = get_user_model()
        fields = ('first_name', 'last_name', 'email', 'faculty', 'is_staff')

    def create(self, validated_data: Dict[str, Any]) -> Model:
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
        # send_mail(
        #     subject="Rejestracja na CHAŁKA",
        #     message=f"""Witaj,\n
        #     Dodano Cię do bazy użytkowników CHAŁKA, z następującymi danymi:
        #         imię: {validated_data['first_name']}
        #         nazwisko: {validated_data['last_name']}
        #         email: {validated_data['email']}
        #         HASŁO: {password}\n
        #     Pozdrawiamy :)
        #     """,
        #     from_email="no-reply@nie.wiem",
        #     recipient_list=[validated_data['email']],
        #     fail_silently=False
        # )
        print(password)

        return user


class ChangePasswordSerializer(Serializer[T]):
    old_password = CharField(required=True)
    new_password = CharField(required=True)
