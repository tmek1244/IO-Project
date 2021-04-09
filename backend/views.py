from typing import Any, Dict, List

from rest_framework import status
from rest_framework.parsers import FileUploadParser, FormParser, MultiPartParser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from backend.serializers import UploadSerializer
from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from rest_framework.generics import CreateAPIView, GenericAPIView
from .serializers import UploadSerializer
from rest_framework.permissions import IsAuthenticated

# Create your views here.

def api(request: WSGIRequest) -> JsonResponse:
    return JsonResponse({"status": "ok"})


class UploadView(CreateAPIView):
    serializer_class = UploadSerializer
    permission_classes = (IsAuthenticated,)
    parser_classes = (FormParser, MultiPartParser)

    def post(self, request: Request, *args: List[Any], **kwargs: Dict[Any, Any]) -> Any:
        serializer = UploadSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            if serializer.create(serializer.validated_data):
                return Response(status=status.HTTP_200_OK)
            else: return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)