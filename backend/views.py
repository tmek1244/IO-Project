from typing import Any, Dict, List, cast

from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.models import Faculty, FieldOfStudy

from .serializers import UploadSerializer


def api(request: WSGIRequest) -> JsonResponse:
    return JsonResponse({"status": "ok"})


class UploadView(CreateAPIView):
    serializer_class = UploadSerializer
    permission_classes = (IsAuthenticated,)
    parser_classes = (FormParser, MultiPartParser)

    def post(self, request: Request,
             *args: List[Any], **kwargs: Dict[Any, Any]) -> Any:
        serializer = UploadSerializer(data=request.data,
                                      context={'request': request})
        if serializer.is_valid():
            if serializer.create(serializer.validated_data):
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class GetFacultiesView(APIView):
    def post(self, request: Request) -> Response:
        return Response(list(Faculty.objects.all()), status=status.HTTP_200_OK)


class GetFieldsOfStudy(APIView):
    def post(self, request: Request) -> Response:
        result: Dict[str, List[str]] = {}
        for field in FieldOfStudy.objects.all():
            if field.faculty is None:
                result['others'] += [field.name]
            else:
                if field.faculty.name in result:
                    result[field.faculty.name].append(field.name)
                else:
                    result[field.faculty.name] = [field.name]
        return Response(result, status=status.HTTP_200_OK)
