from django.contrib.auth.models import User
from rest_framework.request import Request
from backend.models import UploadRequest
from typing import Any, Dict, List

from django.contrib.auth import get_user_model
from django.db.models.base import Model
from rest_framework import serializers

class UploadSerializer(serializers.ModelSerializer[Any]):
    file1 = serializers.FileField()
    file1 = serializers.FileField()
    file1 = serializers.FileField()
    file1 = serializers.FileField()

    class Meta:
        model = UploadRequest
        fields = ('file1',)

    def create(self, validated_data: Dict[str, Any]) -> Model:

        request = self.context.get("request")
        print(request.user)    
        upload_request = UploadRequest.objects.create(user = request.user)
        upload_request.save()

        return upload_request