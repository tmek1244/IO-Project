from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAdminUser

from .serializers import UserSerializer

# Create your views here.


class CreateUserView(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
