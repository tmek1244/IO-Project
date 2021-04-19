from typing import Any, Dict, List

from django.core.handlers.wsgi import WSGIRequest
from django.db.models import Manager
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.filters import RecruitmentResultListFilters
from backend.models import Faculty, FieldOfStudy, RecruitmentResult
from backend.serializers import (RecruitmentResultFacultiesSerializer,
                                 RecruitmentResultFieldsOfStudySerializer,
                                 RecruitmentResultOverviewSerializer,
                                 RecruitmentResultSerializer)

from .serializers import UploadSerializer


def api(request: WSGIRequest) -> JsonResponse:
    return JsonResponse({"status": "ok"})


class RecruitmentResultListView(generics.ListAPIView):
    queryset = RecruitmentResult.objects.all()
    serializer_class: Any = RecruitmentResultSerializer

    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> Manager[RecruitmentResult]:
        filters = RecruitmentResultListFilters(self.request.data) \
            .get_all_arguments()

        return RecruitmentResult.objects.filter(**filters) \
            if len(filters) > 0 else RecruitmentResult.objects.all()

    def post(self, request: Request,
             *args: List[Any], **kwargs: Dict[Any, Any]) -> Response:
        return self.list(request, *args, **kwargs)


class RecruitmentResultOverviewListView(RecruitmentResultListView):
    serializer_class = RecruitmentResultOverviewSerializer


class RecruitmentResultFacultiesListView(generics.ListAPIView):
    serializer_class: Any = RecruitmentResultFacultiesSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> Manager[Any]:
        queryset = Faculty.objects.all()
        return queryset

    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        key: Any = lambda k: k['candidates_count']
        serializer_data = sorted(
            serializer.data,
            key=key,
            reverse=True
        )
        if 'number' in self.request.data:
            serializer_data = serializer_data[:self.request.data['number']]
        return Response(serializer_data)

    def post(self, request: Request,
             *args: List[Any], **kwargs: Dict[Any, Any]) -> Response:
        return self.list(request, *args, **kwargs)


class RecruitmentResultFieldsOfStudyListView(
    RecruitmentResultFacultiesListView
):
    serializer_class = RecruitmentResultFieldsOfStudySerializer

    def get_queryset(self) -> Manager[FieldOfStudy]:
        queryset = FieldOfStudy.objects.\
            filter(degree=self.request.data['degree'])\
            if 'degree' in self.request.data else FieldOfStudy.objects.all()
        return queryset


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
