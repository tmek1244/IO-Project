import datetime
from itertools import groupby
from operator import itemgetter
from typing import Any, Dict, List

import django.db.models
from django.core.handlers.wsgi import WSGIRequest
from django.db.models import Avg, Manager, Max, Min
from django.db.models.aggregates import Count
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.filters import RecruitmentResultListFilters
from backend.models import (Candidate, Faculty, FieldOfStudy, Recruitment,
                            RecruitmentResult)
from backend.serializers import (FacultySerializer, FakeFieldOfStudySerializer,
                                 FieldOfStudyCandidatesPerPlaceSerializer,
                                 RecruitmentResultFacultiesSerializer,
                                 RecruitmentResultFieldsOfStudySerializer,
                                 RecruitmentResultOverviewSerializer,
                                 RecruitmentResultSerializer,
                                 RecruitmentStatusAggregateSerializer,
                                 UploadFieldOfStudySerializer,
                                 UploadSerializer)


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


class RecruitmentResultOverviewListView(generics.ListAPIView):
    queryset = Recruitment.objects.all()
    serializer_class = RecruitmentResultOverviewSerializer

    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> Manager[Recruitment]:
        filters = RecruitmentResultListFilters(self.request.data) \
            .get_recruitment_filters()

        return Recruitment.objects.filter(**filters) \
            if len(filters) > 0 else Recruitment.objects.all()

    def merge_recruitments(self, data: List[Any]) -> List[Any]:
        grouper = itemgetter('field_of_study', 'faculty', 'year', 'degree')
        result = []
        for key, grp in groupby(sorted(data, key=grouper), grouper):
            temp_dict = dict(zip(
                ['field_of_study', 'faculty', 'year', 'degree'], key))
            temp_dict["candidates_count"] = 0
            temp_dict["signed_candidates_count"] = 0
            temp_dict["contest_laureates_count"] = 0
            for item in grp:
                temp_dict["candidates_count"] += item["candidates_count"]
                temp_dict["signed_candidates_count"] += \
                    item["signed_candidates_count"]
                temp_dict["contest_laureates_count"] += \
                    item["contest_laureates_count"]
            result.append(temp_dict)
        return sorted(result, key=itemgetter('year'), reverse=True)

    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(self.merge_recruitments(serializer.data))

    def post(self, request: Request,
             *args: List[Any], **kwargs: Dict[Any, Any]) -> Response:
        return self.list(request, *args, **kwargs)


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


class FieldOfStudyCandidatesPerPlaceListView(generics.ListAPIView):
    serializer_class = FieldOfStudyCandidatesPerPlaceSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> Manager[FieldOfStudy]:
        filters = {}
        if 'degree' in self.request.data:
            filters['degree'] = self.request.data['degree']
        if 'field_of_study' in self.request.data:
            filters['name'] = self.request.data['field_of_study']
        if 'faculty' in self.request.data:
            try:
                faculty = Faculty.objects.filter(
                    name=self.request.data['faculty'])[0]
                filters['faculty'] = faculty
            except IndexError:
                return FieldOfStudy.objects.none()
        queryset = FieldOfStudy.objects.filter(**filters)
        return queryset

    def post(self, request: Request,
             *args: List[Any], **kwargs: Dict[Any, Any]) -> Response:
        return self.list(request, *args, **kwargs)


class RecruitmentStatusAggregateListView(generics.ListAPIView):
    serializer_class = RecruitmentStatusAggregateSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> Manager[Recruitment]:
        filters = {}
        if 'year' in self.kwargs:
            filters['year'] = self.kwargs.get('year')
        else:
            filters['year'] = Recruitment.objects.aggregate(
                Max('year')).get('year__max')
        if 'faculty' in self.kwargs:
            try:
                faculty = Faculty.objects.filter(
                    name=self.kwargs.get('faculty'))[0]
                field_of_study_filters = {'faculty': faculty}
                if 'cycle' in self.kwargs:
                    field_of_study_filters['degree'] = self.kwargs.get('cycle')
                filters['field_of_study__in'] = FieldOfStudy.objects.filter(
                    **field_of_study_filters)
            except IndexError:
                return Recruitment.objects.none()
        queryset = Recruitment.objects.filter(**filters)
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


class UploadFieldsOfStudyView(CreateAPIView):
    serializer_class = UploadFieldOfStudySerializer
    permission_classes = (IsAdminUser,)
    parser_classes = (FormParser, MultiPartParser)

    def post(self, request: Request,
             *args: List[Any], **kwargs: Dict[Any, Any]) -> Any:
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            data['year'] = kwargs['year']
            if serializer.create(data):
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class GetFacultiesView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request) -> Response:
        result: List[str] = [x.name for x in Faculty.objects.all()]
        return Response(result, status=status.HTTP_200_OK)


class GetFieldsOfStudy(APIView):
    def get(self, request: Request) -> Response:
        result: Dict[str, List[str]] = {}
        for field in FieldOfStudy.objects.all():
            if field.faculty.name in result:
                result[field.faculty.name].append(field.name)
            else:
                result[field.faculty.name] = [field.name]
        return Response(result, status=status.HTTP_200_OK)


class AddFacultyView(CreateAPIView):
    serializer_class = FacultySerializer
    permission_classes = (IsAdminUser,)

    def post(self, request: Request, *args: List[Any],
             **kwargs: Dict[Any, Any]) -> Any:
        serializer = FacultySerializer(data=request.data)
        if serializer.is_valid():
            created = serializer.create(serializer.validated_data)
            if created:
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(status=status.HTTP_208_ALREADY_REPORTED)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class AddFieldOfStudy(CreateAPIView):
    serializer_class = FakeFieldOfStudySerializer
    permission_classes = (IsAdminUser,)

    def post(self, request: Request, *args: List[Any],
             **kwargs: Dict[Any, Any]) -> Any:
        serializer = FakeFieldOfStudySerializer(data=request.data)
        if serializer.is_valid():
            created = serializer.create(serializer.validated_data)
            if created:
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class GetBasicData(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request,
            string: str) -> Response:
        try:
            result: Dict[Any, Any] = {}

            if "faculty" == string:
                result["all"] = [faculty.name for faculty in
                                 Faculty.objects.all()]
                return Response(result, status=status.HTTP_200_OK)

            elif "field-of-study" == string:
                for faculty in Faculty.objects.all():
                    result[faculty.name] = set()
                result["all"] = set()

                for fof in FieldOfStudy.objects.all():
                    if fof.faculty:
                        result[fof.faculty.name].add(fof.name)
                    result["all"].add(fof.name)

                for key in result.keys():
                    result[key] = list(sorted(result[key]))
                return Response(result, status=status.HTTP_200_OK)

            elif "year" == string:
                result["all"] = list(sorted(set(
                            recruitment.year for recruitment in
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

            elif "result-name" == string:
                result["all"] = list(RecruitmentResult.objects.
                                     order_by().
                                     values_list('result', flat=True).
                                     distinct())

                return Response(result, status=status.HTTP_200_OK)

            elif "contest" == string:
                result["all"] = list(Candidate.objects.order_by().
                                     values_list('contest', flat=True).
                                     distinct())

                return Response(result, status=status.HTTP_200_OK)

            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)


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


class CompareFields(APIView):
    """Need faculty+field_of_study+year+function"""
    permission_classes = (IsAuthenticated, )

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


class LaureatesOnFOFSView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, year: int = None,
            faculty: str = None) -> Response:
        try:
            last_year = Recruitment.objects.aggregate(Max('year'))["year__max"]
            if faculty:
                tmp = list(RecruitmentResult.objects.
                           filter(recruitment__year=(year or last_year)).
                           filter(result__in=["+", "accepted", "signed"]).
                           exclude(student__contest__isnull=True).
                           exclude(student__contest__exact='').
                           filter(
                             recruitment__field_of_study__faculty__name=faculty
                           ).
                           exclude(
                             recruitment__field_of_study__degree__in=[
                                 "2", "3", "4"]
                           ).
                           values(
                               'recruitment__field_of_study__name')
                           .annotate(total=Count(
                               'recruitment__field_of_study__name')).
                           order_by('total'))
            else:
                tmp = list(RecruitmentResult.objects.
                           filter(recruitment__year=(year or last_year)).
                           filter(result__in=["+", "accepted", "signed"]).
                           exclude(student__contest__isnull=True).
                           exclude(student__contest__exact='').
                           exclude(
                             recruitment__field_of_study__degree__in=[
                                 "2", "3", "4"]
                           ).
                           values(
                               'recruitment__field_of_study__name')
                           .annotate(total=Count(
                               'recruitment__field_of_study__name')).
                           order_by('total'))

            result: Dict[Any, Any] = {"all": 0}

            for d in tmp:
                result[d['recruitment__field_of_study__name']] = d['total']
                result["all"] += d['total']

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(
                {"problem": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class StatusDistributionView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, year: int,
            faculty: str = None, degree: str = None) -> Response:
        try:
            if faculty and degree:
                tmp = list(RecruitmentResult.objects.
                           filter(recruitment__year=year).
                           filter(
                             recruitment__field_of_study__faculty__name=faculty
                           ).
                           filter(recruitment__field_of_study__degree=degree).
                           values(
                               'recruitment__field_of_study__name',
                               'recruitment__round',
                               'result')
                           .annotate(total=Count('result')).
                           order_by('total'))
            elif faculty:
                tmp = list(RecruitmentResult.objects.
                           filter(recruitment__year=year).
                           filter(
                             recruitment__field_of_study__faculty__name=faculty
                           ).
                           values(
                               'recruitment__field_of_study__name',
                               'recruitment__round',
                               'result')
                           .annotate(total=Count('result')).
                           order_by('total'))
            else:
                tmp = list(RecruitmentResult.objects.
                           filter(recruitment__year=year).
                           values(
                               'recruitment__field_of_study__name',
                               'recruitment__round',
                               'result')
                           .annotate(total=Count('result')).
                           order_by('total'))

            result: Dict[Any, Any] = {"all": {}}
            for d in tmp:
                fof = d['recruitment__field_of_study__name']
                round = d['recruitment__round']
                rstatus = d['result']
                total = d['total']

                if fof not in result:
                    result[fof] = {"all": {}}
                if round not in result[fof]:
                    result[fof][round] = {}
                if rstatus not in result["all"]:
                    result["all"][rstatus] = 0
                if rstatus not in result[fof]["all"]:
                    result[fof]["all"][rstatus] = 0

                result[fof][round][rstatus] = total
                result["all"][rstatus] += total
                result[fof]["all"][rstatus] += total

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(
                {"problem": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


def get_median(values: django.db.models.QuerySet[RecruitmentResult]) -> float:

    sorted_list = sorted(list(map(lambda x: x.points, values)))
    if len(sorted_list) % 2 == 0:
        return (
                       sorted_list[len(sorted_list)//2]
                       + sorted_list[len(sorted_list)//2-1]
               )/2
    else:
        return sorted_list[len(sorted_list)//2]


class AvgAndMedOfFields(APIView):
    permission_classes = (IsAuthenticated, )
    """Need faculty+year"""

    def get(self, request: Request, degree: str, faculty_year_list: str
            ) -> Response:
        try:
            result: Dict[str, Dict[str, Any]] = {}
            split_request = faculty_year_list.split('+')
            assert len(split_request) % 2 == 0

            for i in range(len(split_request) // 2):
                this_faculty = {}
                # print(split_request[2*i])
                faculty_obj = Faculty.objects.get(name=split_request[2*i])
                field_obj = FieldOfStudy.objects.filter(
                    faculty=faculty_obj, degree=degree)
                for field in field_obj:
                    recruitment = Recruitment.objects.filter(
                        field_of_study=field, year=split_request[2 * i + 1])
                    recruitment_results = RecruitmentResult.objects.filter(
                        recruitment__in=recruitment, result='Signed')
                    if recruitment_results:
                        this_faculty[field.name] = {
                            'AVG': recruitment_results.aggregate(
                                Avg('points'))['points__avg'],
                            'MED': get_median(recruitment_results)
                        }
                result[
                    split_request[2*i]+' '+split_request[2 * i + 1]
                    ] = this_faculty
            return Response(result)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ActualFacultyThreshold(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request: Request, faculty: str, degree: str) -> Response:
        try:
            faculty_obj = Faculty.objects.get(name=faculty)
            # TODO change after models changes
            result: Dict[str, List[float]] = {}
            for field in FieldOfStudy.objects.filter(
                    faculty=faculty_obj, degree=degree):
                field_list: List[float] = []
                for cycle in range(5):
                    recruitment = Recruitment.objects.filter(
                        field_of_study=field, round=cycle,
                        year=datetime.datetime.now().year)
                    recruitment_results = RecruitmentResult.objects.filter(
                        recruitment__in=recruitment, result='Signed')
                    threshold = recruitment_results.aggregate(
                        Min('points'))['points__min']

                    if threshold:
                        field_list.append(threshold)
                result[field.name] = field_list
            return Response(result)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)


class LastRoundsView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request: Request, year: int = None,
            faculty: str = None,
            field_of_study: str = None,
            degree: str = None) -> Response:
        try:
            tmp: Any = RecruitmentResult.objects.filter(recruitment__year=year)

            if faculty:
                tmp = tmp.filter(
                    recruitment__field_of_study__faculty__name=faculty)
            if field_of_study:
                tmp = tmp.filter(
                    recruitment__field_of_study__name=field_of_study)
            if degree:
                tmp = tmp.filter(recruitment__field_of_study__degree=degree)

            tmp = (tmp.values(
                'recruitment__field_of_study__name',
                'recruitment__round')
                .annotate(max_round=Count('recruitment__round')).
                order_by('max_round'))

            result: Dict[Any, Any] = {}

            for d in tmp:
                result[d['recruitment__field_of_study__name']] = d["recruitment__round"]

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(
                {"problem": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
