from typing import Any, Dict, List

from django.core.handlers.wsgi import WSGIRequest
from django.db.models import Avg, Manager, Max, Min
from django.db.models.aggregates import Count
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.filters import RecruitmentResultListFilters
from backend.models import (Candidate, Faculty, FieldOfStudy, Recruitment,
                            RecruitmentResult)
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


class FieldOfStudyContestLaureatesCountView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, string: str = "faculty+field") -> Response:
        try:
            result: List[Dict[str, Any]] = []
            faculty, field = string.split('+')
            faculty_obj = Faculty.objects.get(name=faculty)
            field_obj = FieldOfStudy.objects.get(name=field,
                                                 faculty=faculty_obj)
            recruitment = Recruitment.objects.filter(field_of_study=field_obj)
            candidates = Candidate.objects\
                .exclude(contest__isnull=True)\
                .exclude(contest__exact='')
            print(candidates)
            recruitment_results = RecruitmentResult.objects\
                .order_by('-recruitment__year')\
                .filter(recruitment__in=recruitment, student__in=candidates)
            if recruitment_results:
                result = list(recruitment_results.values('recruitment__year')
                              .annotate(contest_laureates=Count('student')))

            return Response(result)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


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


class CompareFields(APIView):
    # permission_classes = (IsAuthenticated, )

    def get(self, request: Request, string: str) -> Response:
        try:
            result: List[Dict[str, Any]] = []
            split_request = string.split('+')
            assert len(split_request) % 4 == 0

            for i in range(len(split_request) // 4):
                print(split_request[4*i])
                faculty_obj = Faculty.objects.get(name=split_request[4*i])
                field_obj = FieldOfStudy.objects.get(
                    name=split_request[4*i + 1], faculty=faculty_obj)
                recruitment = Recruitment.objects.filter(
                    field_of_study=field_obj, year=split_request[4*i + 2])
                recruitment_results = RecruitmentResult.objects.filter(
                    recruitment__in=recruitment, result='Signed')
                fun_to_apply = {
                    'MAX': Max,
                    'MIN': Min,
                    'AVG': Avg
                }[split_request[4*i+3]]

                if recruitment_results and fun_to_apply:
                    result.append({
                        'faculty': split_request[4*i],
                        'field': split_request[4*i + 1],
                        'year': split_request[4*i + 2],
                        'function': split_request[4*i + 3],
                        'result': recruitment_results.values(
                            'recruitment__year').annotate(
                            result=fun_to_apply('points'))[0]['result']
                    })

            return Response(result)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)
