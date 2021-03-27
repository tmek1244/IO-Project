from typing import Any, List

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.state import User
from rest_framework_simplejwt.tokens import RefreshToken


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
