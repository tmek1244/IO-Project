from typing import Any, Dict, List

import django.db.models
from django.core.handlers.wsgi import WSGIRequest
from django.db.models import Avg, F, Manager, Max, Min
from django.db.models.aggregates import Count
from django.db.models.fields import IntegerField
from django.db.models.functions import Cast
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.filters import RecruitmentResultListFilters
from backend.models import (Candidate, Faculty, FieldOfStudy,
                            FieldOfStudyPlacesLimit, Recruitment,
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


class FieldOfStudyNotFullView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_recruitment_results_filter(self) -> Dict[str, Any]:
        return {}

    def get(self,  request: Request) -> Any:
        if 'year' in self.kwargs:
            year = self.kwargs.get('year')
        else:
            year = Recruitment.objects.aggregate(
                Max('year')).get('year__max')
        fields_of_study = FieldOfStudy.objects.all()
        result = []
        for field_of_study in fields_of_study:
            recruitments = Recruitment.objects.filter(
                year=year,
                field_of_study=field_of_study
            )
            recruitment_results_filter = self.get_recruitment_results_filter()
            recruitment_results_filter["recruitment__in"] = recruitments
            candidates = RecruitmentResult.objects.filter(
                recruitment__in=recruitments).values_list(
                'student', flat=True).distinct().count()
            places = FieldOfStudyPlacesLimit.objects.filter(
                field_of_study=field_of_study,
                year=year
            )
            if len(places) != 0 and candidates < places[0].places:
                result.append({
                    "faculty": field_of_study.faculty.name,
                    "field_of_study": field_of_study.name,
                    "degree": field_of_study.degree,
                    "type": field_of_study.type,
                    "candidate_per_place": round(
                        candidates / places[0].places, 2)
                })
        return Response(result)


class FieldOfStudyNotFullSignedView(FieldOfStudyNotFullView):
    def get_recruitment_results_filter(self) -> Dict[str, Any]:
        return {"result": "signed"}


class RecruitmentResultOverviewListView(generics.ListAPIView):
    queryset = Recruitment.objects.all()
    serializer_class = RecruitmentResultOverviewSerializer

    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> Manager[Recruitment]:
        filters = RecruitmentResultListFilters(self.request.data) \
            .get_recruitment_filters()

        return Recruitment.objects.filter(**filters) \
            if len(filters) > 0 else Recruitment.objects.all()

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
        filters = {}
        if 'degree' in self.request.data:
            filters['degree'] = self.request.data['degree']
        if 'type' in self.request.data:
            filters['type'] = self.request.data['type']
        return FieldOfStudy.objects.filter(**filters)


class FieldOfStudyCandidatesPerPlaceListView(generics.ListAPIView):
    serializer_class = FieldOfStudyCandidatesPerPlaceSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> Manager[FieldOfStudy]:
        filters = {}
        if 'degree' in self.request.data:
            filters['degree'] = self.request.data['degree']
        if 'type' in self.request.data:
            filters['type'] = self.request.data['type']
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
                print(faculty)
                field_of_study_filters = {'faculty': faculty}
                if 'cycle' in self.kwargs:
                    field_of_study_filters['degree'] = self.kwargs.get('cycle')
                    print(field_of_study_filters['degree'])
                if 'type' in self.kwargs:
                    field_of_study_filters['type'] = self.kwargs.get('type')
                    print(field_of_study_filters['type'])
                filters['field_of_study__in'] = FieldOfStudy.objects.filter(
                    **field_of_study_filters)
            except IndexError:
                return Recruitment.objects.none()
        queryset = Recruitment.objects.filter(**filters)
        return queryset


class FieldOfStudyContestLaureatesCountView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request,
            string: str = "faculty+field+type") -> Response:
        try:
            result: List[Dict[str, Any]] = []
            type = None
            try:
                faculty, field, type = string.split('+')
            except Exception:
                faculty, field = string.split('+')
            faculty_obj = Faculty.objects.get(name=faculty)
            field_filters = {
                "name": field,
                "faculty": faculty_obj,
                "degree": 1
            }
            if type is not None:
                field_filters["type"] = type
            field_obj = FieldOfStudy.objects.get(**field_filters)
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
    def get(self, request: Request, degree: str) -> Response:
        result: Dict[str, List[str]] = {}
        for field in FieldOfStudy.objects.filter(degree=degree):
            if field.faculty.name in result:
                result[field.faculty.name].append(field.name)
            else:
                result[field.faculty.name] = [field.name]
        return Response(result, status=status.HTTP_200_OK)


class GetFieldsOfStudyByType(APIView):
    def get(self, request: Request, degree: str, type: str) -> Response:
        result: Dict[str, List[str]] = {}
        for field in FieldOfStudy.objects.filter(degree=degree, type=type):
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

    def get(self, request: Request, degree: str, type: str,
            string: str = "faculty+field") -> Response:
        try:
            print(type)
            result: List[Dict[str, Any]] = []
            faculty, field = string.split('+')
            faculty_obj = Faculty.objects.get(name=faculty)
            field_obj = FieldOfStudy.objects.get(
                name=field, faculty=faculty_obj,
                degree=degree, type=type)
            print(field_obj)
            recruitment_results = RecruitmentResult.objects.filter(
                result='signed', recruitment__field_of_study=field_obj)
            print(recruitment_results)
            if recruitment_results:
                result = list(recruitment_results.order_by().values(
                    'recruitment__year').annotate(min_points=Min('points')))
            return Response(result)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)


class CandidatesPerPlace(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request,
            string: str = "faculty+field+degree+type") -> Response:
        try:
            result: List[Dict[str, Any]] = []
            faculty, field, degree, type = string.split('+')
            faculty_obj = Faculty.objects.get(name=faculty)
            field_obj = FieldOfStudy.objects.get(
                name=field, faculty=faculty_obj, degree=degree,
                type=type)
            recruitments = Recruitment.objects.filter(
                field_of_study=field_obj, round=1)
            for recruitment in recruitments:
                places = FieldOfStudyPlacesLimit.objects.filter(
                    field_of_study=field_obj, year=recruitment.year
                )
                if len(places) == 0:
                    continue
                places_value: int = int(places[0].places)
                recruitment_all_cycles = Recruitment.objects.filter(
                    field_of_study=field_obj, year=recruitment.year
                )
                candidates = RecruitmentResult.objects.filter(
                    recruitment__in=recruitment_all_cycles).values_list(
                    'student', flat=True).distinct().count()
                candidates_per_place = round(candidates / places_value, 2)
                result.append({
                    "year": recruitment.year,
                    "candidates_per_place": candidates_per_place
                })
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
                    recruitment__in=recruitment, result='signed')
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


class FieldConversionView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request,
            year: int = None,
            faculty: str = None,
            field_of_study: str = None,
            type: str = None) -> Response:

        try:
            year = year or (
                Recruitment.objects.aggregate(Max('year'))["year__max"])

            rrs = (
                RecruitmentResult.objects.
                filter(result__in=["$", "+", "accepted", "signed"]).
                filter(recruitment__field_of_study__degree__in=["2", "3", "4"])
                )

            if year:
                rrs = rrs.filter(recruitment__year=year)
            if faculty:
                rrs = rrs.filter(
                    recruitment__field_of_study__faculty__name=faculty)
            if field_of_study:
                rrs = rrs.filter(
                    recruitment__field_of_study__name=field_of_study)
            if type:
                rrs = rrs.filter(
                    recruitment__field_of_study__type=type)

            result = {"all": {"from-inside": 0, "from-outside": 0}}
            for rr in rrs:
                try:
                    faculty_name = rr.recruitment.field_of_study.faculty.name
                    fof_name = rr.recruitment.field_of_study.name

                    if fof_name not in result:
                        result[fof_name] = {"from-inside": 0,
                                            "from-outside": 0}

                    if (
                        rr.student.graduatedschool_set.
                        filter(school_name="AGH").
                        filter(faculty=faculty_name).
                        filter(field_of_study=fof_name)
                    ):
                        result[fof_name]["from-inside"] += 1
                        result["all"]["from-inside"] += 1
                    else:
                        result[fof_name]["from-outside"] += 1
                        result["all"]["from-outside"] += 1

                except Exception as e:
                    print(e)

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"problem": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class LaureatesOnFOFSView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, year: int = None,
            faculty: str = None, type: str = None) -> Response:
        try:
            last_year = Recruitment.objects.aggregate(Max('year'))["year__max"]
            if faculty and type:
                tmp = list(RecruitmentResult.objects.
                           filter(recruitment__year=(year or last_year)).
                           filter(result__in=["+", "accepted", "signed"]).
                           exclude(student__contest__isnull=True).
                           exclude(student__contest__exact='').
                           filter(
                            recruitment__field_of_study__faculty__name=faculty,
                            recruitment__field_of_study__faculty__type=type
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
            elif faculty:
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
            faculty: str = None, degree: str = None,
            type: str = None) -> Response:
        try:
            if faculty and degree and type:
                tmp = list(RecruitmentResult.objects.
                           filter(recruitment__year=year).
                           filter(
                             recruitment__field_of_study__faculty__name=faculty
                           ).
                           filter(recruitment__field_of_study__degree=degree).
                           filter(recruitment__field_of_study__type=type).
                           values(
                               'recruitment__field_of_study__name',
                               'recruitment__round',
                               'result')
                           .annotate(total=Count('result')).
                           order_by('total'))
            elif faculty and degree:
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


class StatusDistributionOverTheYearsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, faculty: str = None,
            field_of_study: str = None,
            degree: str = None, type: str = None) -> Response:
        try:
            tmp: Any = RecruitmentResult.objects

            if faculty:
                tmp = tmp.filter(
                    recruitment__field_of_study__faculty__name=faculty)
            if field_of_study:
                tmp = tmp.filter(
                    recruitment__field_of_study__name=field_of_study)
            if degree:
                tmp = tmp.filter(recruitment__field_of_study__degree=degree)
            if type:
                tmp = tmp.filter(recruitment__field_of_study__type=type)

            tmp = (tmp.values(
                'recruitment__field_of_study__name',
                'recruitment__year',
                'result')
                .annotate(total=Count('result')).
                order_by('total'))

            result: Dict[Any, Any] = {}
            for d in tmp:
                fof = d['recruitment__field_of_study__name']
                year = d['recruitment__year']
                rstatus = d['result']
                total = d['total']

                if fof not in result:
                    result[fof] = {}
                if year not in result[fof]:
                    result[fof][year] = {}

                result[fof][year][rstatus] = total

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

    def get(self, request: Request, degree: str, faculty_year_list: str,
            type: str = None) -> Response:
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
                if type is not None:
                    field_obj.filter(type=type)
                for field in field_obj:
                    recruitment = Recruitment.objects.filter(
                        field_of_study=field, year=split_request[2 * i + 1])
                    recruitment_results = RecruitmentResult.objects.filter(
                        recruitment__in=recruitment, result='signed')
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
                        year=Recruitment.objects.aggregate(
                            Max('year'))["year__max"])
                    recruitment_results = RecruitmentResult.objects.filter(
                        recruitment__in=recruitment, result='signed')
                    threshold = recruitment_results.aggregate(
                        Min('points'))['points__min']

                    if threshold:
                        field_list.append(threshold)
                result[field.name] = field_list
            return Response(result)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)


class RecruitmentYears(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request) -> Response:
        try:
            recruitments = Recruitment.objects.values_list(
                'year',
                flat=True).distinct()
            print(recruitments)
            return Response(recruitments)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)


class GetMostLaureate(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, n: int, year: int,
            type: str = None) -> Response:
        try:
            result: Dict[str, float] = {}
            field_filters: Dict[str, Any] = {"degree": 1}
            if type is not None:
                field_filters["type"] = type
            for field in FieldOfStudy.objects.filter(**field_filters):
                query = RecruitmentResult.objects.filter(
                    recruitment__year=year,
                    recruitment__field_of_study=field,
                    result="signed",
                    student__contest__isnull=False
                )
                result[field.name] = len(query)
            return Response(
                {k: v for k, v in sorted(
                    result.items(), key=lambda item: item[1],
                    reverse=True)[:n]})
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class FacultyPopularity(APIView):
    permission_classes = (IsAuthenticated,)

    def get(
            self, request: Request, pop_type: str,
            degree: str, n: int, year: int, type: str = None) -> Response:
        try:
            result: Dict[str, float] = {}
            field_filters = {"degree": degree}
            if type is not None:
                field_filters["type"] = type
            for field in FieldOfStudy.objects.filter(**field_filters):
                query = RecruitmentResult.objects.filter(
                    recruitment__year=year,
                    recruitment__field_of_study=field
                ).values("student").distinct()
                result[field.name] = len(query)/(
                    FieldOfStudyPlacesLimit.objects.get(
                        year=year, field_of_study=field).places)

            return Response(
                {k: v for k, v in sorted(
                    result.items(), key=lambda item: item[1],
                    reverse=True if pop_type == "most" else False)[:n]})
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class FacultyThreshold(APIView):
    permission_classes = (IsAuthenticated,)

    def get(
            self, request: Request, mode: str,
            degree: str, n: int, year: int, type: str = None) -> Response:
        try:
            result: Dict[str, float] = {}
            field_filters = {"degree": degree}
            if type is not None:
                field_filters["type"] = type
            for field in FieldOfStudy.objects.filter(**field_filters):
                query = RecruitmentResult.objects.filter(
                    recruitment__year=year,
                    recruitment__field_of_study=field,
                    result="signed"
                ).aggregate(Min('points'))['points__min']
                result[field.name] = query if query else 0

            return Response(
                {k: v for k, v in sorted(
                    result.items(), key=lambda item: item[1],
                    reverse=True if mode == "top" else False)[:n]})
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class FieldConversionOverTheYearsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request,
            faculty: str = None,
            field_of_study: str = None,
            type: str = None) -> Response:

        try:

            rrs = (
                RecruitmentResult.objects.
                filter(result__in=["$", "+", "accepted", "signed"]).
                filter(recruitment__field_of_study__degree__in=["2", "3", "4"])
                )

            if faculty:
                rrs = rrs.filter(
                    recruitment__field_of_study__faculty__name=faculty)
            if field_of_study:
                rrs = rrs.filter(
                    recruitment__field_of_study__name=field_of_study)

            if type:
                rrs = rrs.filter(
                    recruitment__field_of_study__type=type)

            rrs.values(
                'recruitment__field_of_study__faculty__name',
                'recruitment__year'
            )

            result: Dict[Any, Any] = {}
            for rr in rrs:
                try:
                    faculty_name = rr.recruitment.field_of_study.faculty.name
                    fof_name = rr.recruitment.field_of_study.name
                    year = rr.recruitment.year

                    if fof_name not in result:
                        result[fof_name] = {}

                    if year not in result[fof_name]:
                        result[fof_name][year] = {
                            "from-inside": 0,
                            "from-outside": 0}

                    if (
                        rr.student.graduatedschool_set.
                        filter(school_name="AGH").
                        filter(faculty=faculty_name).
                        filter(field_of_study=fof_name)
                    ):
                        result[fof_name][year]["from-inside"] += 1
                    else:
                        result[fof_name][year]["from-outside"] += 1

                except Exception as e:
                    print(e)

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response(
                {"problem": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class PointsDistributionOverTheYearsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, step: int = 100,
            faculty: str = None,
            field_of_study: str = None,
            degree: str = None,
            type: str = None) -> Response:
        try:
            tmp: Any = (RecruitmentResult.objects.
                        filter(result__in=["$", "+", "accepted", "signed"]))
            if faculty:
                tmp = tmp.filter(
                    recruitment__field_of_study__faculty__name=faculty)
            if field_of_study:
                tmp = tmp.filter(
                    recruitment__field_of_study__name=field_of_study)
            if degree:
                tmp = tmp.filter(recruitment__field_of_study__degree=degree)
            if type:
                tmp = tmp.filter(recruitment__field_of_study__type=type)

            tmp = (tmp.values(
                    'recruitment__field_of_study__name',
                    'recruitment__year',
                    'points'
                )
                .annotate(ints=Cast('points', IntegerField()))
                .annotate(mod_step=F('ints') % step)
                .annotate(bucket=F('ints') - F("mod_step"))
                .values(
                    'recruitment__field_of_study__name',
                    'recruitment__year',
                    'bucket'
                )
                .annotate(total=Count("bucket"))
                .order_by("total")
                )

            print(tmp)

            result: Dict[Any, Any] = {}
            for d in tmp:
                fof = d['recruitment__field_of_study__name']
                year = d['recruitment__year']
                bucket = d['bucket']
                total = d['total']

                if fof not in result:
                    result[fof] = {}
                if year not in result[fof]:
                    result[fof][year] = {}

                result[fof][year][bucket] = total
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(
                {"problem": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class LastRoundsView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request: Request, year: int = None,
            faculty: str = None,
            field_of_study: str = None,
            degree: str = None,
            type: str = None) -> Response:
        try:
            tmp: Any = RecruitmentResult.objects
            if faculty:
                tmp = tmp.filter(
                    recruitment__field_of_study__faculty__name=faculty)
            if field_of_study:
                tmp = tmp.filter(
                    recruitment__field_of_study__name=field_of_study)
            if degree:
                tmp = tmp.filter(recruitment__field_of_study__degree=degree)
            if type:
                tmp = tmp.filter(recruitment__field_of_study__type=type)
            tmp = (
                tmp
                .values(
                    'recruitment__field_of_study__name',
                    'recruitment__year',
                )
                .annotate(max_round=Max('recruitment__round'))
                .order_by('max_round'))

            result: Dict[Any, Any] = {}

            for d in tmp:
                fof = d['recruitment__field_of_study__name']
                year = d['recruitment__year']
                max_round = d['max_round']

                if fof not in result:
                    result[fof] = {}

                result[fof][year] = max_round
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(
                {"problem": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class ChangesAfterCycle(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request,
            faculty: str = None,
            field_of_study: str = None,
            degree: str = None,
            year: int = None,
            type: int = None) -> Response:
        try:
            result: Dict[int, Dict[str, int]] = {}
            assert year
            recruitment_result_filters = {
                "recruitment__field_of_study__faculty__name": faculty,
                "recruitment__field_of_study__name": field_of_study,
                "recruitment__field_of_study__degree": degree,
                "recruitment__year": year
            }
            if type is not None:
                recruitment_result_filters[
                    "recruitment__field_of_study__type"] = type
            query_result = RecruitmentResult.objects.filter(
                **recruitment_result_filters).values(
                'result',
                'recruitment__round'
            ).order_by().annotate(count=Count("id"))

            for element in query_result:
                if element['recruitment__round'] in result:
                    result[element['recruitment__round']][
                        element['result']] = element['count']
                else:
                    result[element['recruitment__round']] = {
                        element['result']: element['count']}

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(
                {"problem": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
