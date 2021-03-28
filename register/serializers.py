from typing import Dict, Type
from django.db.models.base import Model

from rest_framework import serializers
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'first_name', 'last_name', 'email', 'password')
        extra_kwargs = {'password':{'write_only':True}}

    def create(self, validated_data:Dict) -> Model:
        user = get_user_model().objects.create(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email']
        )

        user.set_password(validated_data['password'])

        user.save()

        return user
