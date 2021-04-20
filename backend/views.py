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
from backend.models import (Faculty, FieldOfStudy, Recruitment,
                            RecruitmentResult)
from backend.serializers import (RecruitmentResultOverviewSerializer,
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


class GetBasicData(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request,
            string: str) -> Response:
        try:
            result: Dict[str, Any] = {}

            if "faculty" == string:
                result["all"] = [faculty.name for faculty in
                                     Faculty.objects.all()]
                return Response(result, status=status.HTTP_200_OK)

            elif "field-of-study" == string:
                for faculty in Faculty.objects.all():
                    result[faculty.name] = []
                result["all"] = []

                for fof in FieldOfStudy.objects.all():
                    if fof.faculty:
                        result[fof.faculty.name].append(fof.name)
                    result["all"].append(fof.name)
                return Response(result, status=status.HTTP_200_OK)

            elif "year" == string:
                result["all"] = list(sorted(set(recruitment.year for recruitment in
                                          Recruitment.objects.all())))
                return Response(result, status=status.HTTP_200_OK)

            elif "round" == string:
                for recruitment in Recruitment.objects.all():
                    result[recruitment.year] = set()
                result["all"] = set()
                
                for recruitment in Recruitment.objects.all():
                    result[recruitment.year].add(recruitment.round)
                    result["all"].add(recruitment.round)

                for key in result.keys():
                    result[key] = list(sorted(result[key]))

                return Response(result, status=status.HTTP_200_OK)

            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(e)
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)
