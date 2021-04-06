from django.contrib.auth.models import User
from rest_framework.request import Request
from backend.models import UploadRequest
from typing import Any, Dict, List

from django.contrib.auth import get_user_model
from django.db.models.base import Model
from rest_framework import serializers

import csv

class UploadSerializer(serializers.ModelSerializer[Any]):
    file1 = serializers.FileField()
    file2 = serializers.FileField(required=False)
    file3 = serializers.FileField(required=False)
    file4 = serializers.FileField(required=False)

    class Meta:
        model = UploadRequest
        fields = ('file1', 'file2', 'file3', 'file4')

    def create(self, validated_data: Dict[str, Any]) -> Model:

        request = self.context.get("request")
        upload_request = UploadRequest.objects.create(user = request.user)
        upload_request.save()

        reader = csv.reader(validated_data["file1"], 'utf-8')
        print(*reader)

        return upload_request