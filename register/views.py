from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAdminUser
from django.contrib.auth import get_user_model

from .serializers import UserSerializer

# Create your views here.

class CreateUserView(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


