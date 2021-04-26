from typing import Any, Dict

from django.db.models import Model
from django.db.models.aggregates import Max, Min
from rest_framework import serializers

from .models import (Candidate, ExamResult, Faculty, FieldOfStudy, Grade,
                     GraduatedSchool, Recruitment, RecruitmentResult,
                     UploadRequest)


class CandidateSerializer(serializers.ModelSerializer[Any]):
    class Meta:
        model = Candidate
        fields = '__all__'


class FacultySerializer(serializers.ModelSerializer[Any]):
    class Meta:
        model = Faculty
        fields = '__all__'


class FieldOfStudySerializer(serializers.ModelSerializer[Any]):
    faculty = FacultySerializer(read_only=True)

    class Meta:
        model = FieldOfStudy
        fields = '__all__'


class RecruitmentSerializer(serializers.ModelSerializer[Any]):
    field_of_study = FieldOfStudySerializer(read_only=True)

    class Meta:
        model = Recruitment
        fields = '__all__'


class RecruitmentResultSerializer(serializers.ModelSerializer[Any]):
    student = CandidateSerializer(read_only=True)
    recruitment = RecruitmentSerializer(read_only=True)

    class Meta:
        model = RecruitmentResult
        fields = '__all__'


class RecruitmentResultOverviewSerializer(serializers.ModelSerializer[Any]):
    cycle = serializers. \
        ReadOnlyField(source='recruitment.field_of_study.degree')
    year = serializers.ReadOnlyField(source='recruitment.year')
    recruitment_round = serializers.ReadOnlyField(source='recruitment.round')
    faculty = serializers. \
        ReadOnlyField(source='recruitment.field_of_study.faculty.name')
    field_of_study = serializers. \
        ReadOnlyField(source='recruitment.field_of_study.name')
    first_name = serializers.ReadOnlyField(source='student.first_name')
    last_name = serializers.ReadOnlyField(source='student.last_name')
    year_of_exam = serializers.ReadOnlyField(source='student.year_of_exam')
    city = serializers.ReadOnlyField(source='student.city')
    date_of_birth = serializers.ReadOnlyField(source='student.date_of_birth')
    gender = serializers.ReadOnlyField(source='student.gender')

    class Meta:
        model = RecruitmentResult
        fields = ('cycle', 'year', 'recruitment_round', 'faculty',
                  'field_of_study', 'result', 'points', 'first_name',
                  'last_name', 'year_of_exam', 'city', 'date_of_birth',
                  'gender')


class RecruitmentResultAggregateSerializer(serializers.ModelSerializer[Any]):

    candidates_count = serializers.SerializerMethodField()
    first_cycle_threshold = serializers.SerializerMethodField()
    second_cycle_threshold = serializers.SerializerMethodField()
    third_cycle_threshold = serializers.SerializerMethodField()
    thresholds = serializers.SerializerMethodField()

    def get_recruitments_filters(self, obj: Any) -> Any:
        pass

    def get_candidates_count(self, obj: Any) -> int:
        recruitments = Recruitment.objects.\
            filter(**self.get_recruitments_filters(obj))
        return RecruitmentResult.objects\
            .filter(recruitment__in=recruitments)\
            .values_list('student', flat=True)\
            .distinct().count()

    def get_cycle_threshold(self, obj: Any, cycle: int) -> Any:
        recruitments_filters = self.get_recruitments_filters(obj)
        recruitments_filters['round'] = cycle
        recruitments = Recruitment.objects.filter(**recruitments_filters)
        recruitment_results = RecruitmentResult.objects.filter(
            recruitment__in=recruitments, result='Signed'
        )
        if recruitment_results:
            result = recruitment_results.aggregate(Min('points')).\
                get('points__min')
            return result
        return None

    def get_thresholds(self, obj: Any) -> Any:
        result = {}
        recruitments = Recruitment.objects\
            .filter(**self.get_recruitments_filters(obj))
        number_of_cycles = recruitments\
            .aggregate(Max('round')).get('round__max')
        if number_of_cycles is not None:
            for cycle in range(1, number_of_cycles):
                cycle_threshold = self.get_cycle_threshold(obj, cycle)
                if cycle_threshold is not None:
                    result[cycle] = self.get_cycle_threshold(obj, cycle)
            return result
        return None


class RecruitmentResultFacultiesSerializer(
    RecruitmentResultAggregateSerializer
):
    class Meta:
        model = Faculty
        fields = ('name', 'candidates_count', 'thresholds')

    def get_recruitments_filters(self, obj: Faculty) -> Dict[str, Any]:
        field_of_studies_filters = {'faculty': obj}
        if 'degree' in self.context['request'].data:
            field_of_studies_filters['degree'] = \
                self.context['request'].data['degree']
        field_of_studies = \
            FieldOfStudy.objects.filter(**field_of_studies_filters)
        recruitments_filters = {'field_of_study__in': field_of_studies}
        if 'year' in self.context['request'].data:
            recruitments_filters['year'] = self.context['request'].data['year']
        return recruitments_filters


class RecruitmentResultFieldsOfStudySerializer(
    RecruitmentResultAggregateSerializer
):
    faculty = serializers.ReadOnlyField(source='faculty.name')

    class Meta:
        model = FieldOfStudy
        fields = ('name', 'faculty', 'degree', 'candidates_count',
                  'thresholds')

    def get_recruitments_filters(self, obj: FieldOfStudy) -> Dict[str, Any]:
        recruitments_filters = {'field_of_study': obj}
        if 'year' in self.context['request'].data:
            recruitments_filters['year'] = self.context['request'].data['year']
        return recruitments_filters


class UploadSerializer(serializers.ModelSerializer[Any]):
    file = serializers.FileField()

    class Meta:
        model = UploadRequest
        fields = ('file',)

    def create(self, validated_data: Dict[str, Any]) -> Any:

        request = self.context.get("request")
        if not request:
            return None
        upload_request = UploadRequest.objects.create(user=request.user)
        upload_request.save()

        try:

            for line in validated_data["file"]:
                (first_name, last_name, date_of_birth, gender, year_of_exam,
                 city, school_city, school_type, school_name,
                 graduade_faculty, graduade_field_of_study, mode,
                 grade_IT, grade_math, grade_english, points_IT, points_math,
                 points_english, year, round, field_of_study_name, points,
                 result) = line.decode("utf-8").strip().split(",")

                candidate = create_candidate(upload_request, first_name,
                                             last_name, date_of_birth, gender,
                                             year_of_exam, city)

                graduated_school = create_graduated_school(
                    upload_request, candidate, school_city,
                    school_type, school_name, graduade_faculty,
                    graduade_field_of_study, mode)

                create_grade(upload_request, graduated_school, "IT",
                             grade_IT)
                create_grade(upload_request, graduated_school, "math",
                             grade_math)
                create_grade(upload_request, graduated_school, "english",
                             grade_english)

                create_exam_result(upload_request, candidate, "IT",
                                   points_IT)
                create_exam_result(upload_request, candidate, "math",
                                   points_math)
                create_exam_result(upload_request, candidate, "english",
                                   points_english)

                field_of_study = create_field_of_study(upload_request,
                                                       field_of_study_name)

                recruitment = create_recruitment(
                    upload_request, field_of_study,
                    year, round)

                create_recruitment_result(upload_request,
                                          candidate, recruitment,
                                          points, result)

        except Exception:
            upload_request.delete()
            return None

        return upload_request


def create_candidate(upload_request: Any, first_name: str, last_name: str,
                     date_of_birth: str, gender: str, year_of_exam: str,
                     city: str) -> Any:
    candidate, created = Candidate.objects.get_or_create(
        first_name=first_name,
        last_name=last_name,
        date_of_birth=date_of_birth,
        gender=gender,
        year_of_exam=year_of_exam,
        city=city
    )
    if created:
        candidate.upload_request = upload_request
        candidate.save()
    return candidate


def create_graduated_school(upload_request: Any, candidate: Model,
                            school_city: str, school_type: str,
                            school_name: str, graduade_faculty: str,
                            graduade_field_of_study: str, mode: str) -> Any:
    graduated_school, created = GraduatedSchool.objects.get_or_create(
        candidate=candidate,
        school_city=school_city,
        school_type=school_type,
        school_name=school_name,
        faculty=graduade_faculty,
        field_of_study=graduade_field_of_study,
        mode=mode
    )
    if created:
        graduated_school.upload_request = upload_request
        graduated_school.save()
    return graduated_school


def create_grade(upload_request: Any, graduated_school: Model, subject: str,
                 grade_subject: str) -> Any:
    grade, created = Grade.objects.get_or_create(
        school=graduated_school,
        subject=subject,
        grade=grade_subject
    )
    if created:
        grade.upload_request = upload_request
        grade.save()
    return grade


def create_exam_result(upload_request: Any, candidate: Model, subject: str,
                       result_subject: str) -> Any:
    exam_result, created = ExamResult.objects.get_or_create(
        candidate=candidate,
        subject=subject,
        result=result_subject
    )
    if created:
        exam_result.upload_request = upload_request
        exam_result.save()
    return exam_result


def create_field_of_study(upload_request: Any,
                          field_of_study_name: str) -> Any:
    field_of_study, created = FieldOfStudy.objects.get_or_create(
        name=field_of_study_name
    )
    if created:
        field_of_study.upload_request = upload_request
        field_of_study.save()
    return field_of_study


def create_recruitment(upload_request: Any, field_of_study: Model, year: str,
                       round: str) -> Any:
    recruitment, created = Recruitment.objects.get_or_create(
        field_of_study=field_of_study,
        year=year,
        round=round
    )
    if created:
        recruitment.upload_request = upload_request
        recruitment.save()
    return recruitment


def create_recruitment_result(upload_request: Any, candidate: Model,
                              recruitment: Model, points: str,
                              result: str) -> Any:
    recruitment_result, created = RecruitmentResult.objects.get_or_create(
        student=candidate,
        recruitment=recruitment,
        points=points,
        result=result
    )
    if created:
        recruitment_result.upload_request = upload_request
        recruitment_result.save()
    return recruitment_result
