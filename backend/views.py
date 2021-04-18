from typing import Any, Dict, List

from django.core.handlers.wsgi import WSGIRequest
from django.db.models import Manager, Min
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.filters import RecruitmentResultListFilters
from backend.models import (Faculty, FieldOfStudy, Recruitment,
                            RecruitmentResult)
from backend.serializers import (RecruitmentResultOverviewSerializer,
                                 RecruitmentResultSerializer, UploadSerializer)


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
    def get(self, request: Request) -> Response:
        return Response(list(Faculty.objects.all()), status=status.HTTP_200_OK)


class GetFieldsOfStudy(APIView):
    def get(self, request: Request) -> Response:
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


class GetThresholdOnField(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, string: str = "faculty+field") -> Response:
        try:
            result: List[Dict[str, Any]] = []
            faculty, field = string.split('+')
            faculty_obj = Faculty.objects.get(name=faculty)
            field_obj = FieldOfStudy.objects.get(name=field,
                                                 faculty=faculty_obj)
            recruitment = Recruitment.objects.filter(field_of_study=field_obj)
            recruitment_results = RecruitmentResult.objects.filter(
                recruitment__in=recruitment, result='Signed')
            if recruitment_results:
                result = list(recruitment_results.values(
                    'recruitment__year').annotate(max_points=Min('points')))

            return Response(result)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)
