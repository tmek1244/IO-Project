from typing import Any, Dict

from django.db.models import Model
from django.db.models.aggregates import Max, Min
from rest_framework import serializers

from .models import (Candidate, ExamResult, Faculty, FieldOfStudy,
                     FieldOfStudyNextDegree, FieldOfStudyPlacesLimit, Grade,
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

    def create(self, validated_data: Dict[str, Any]) -> bool:
        faculty, created = Faculty.objects.get_or_create(
            name=validated_data["name"]
        )
        faculty.save()

        return created


class FakeFieldOfStudySerializer(serializers.ModelSerializer[Any]):
    faculty = serializers.CharField(required=True)

    class Meta:
        model = FieldOfStudy
        fields = ('faculty', 'name', 'degree')

    def create(self, validated_data: Dict[str, Any]) -> bool:
        try:
            fof, created = FieldOfStudy.objects.get_or_create(
                faculty=Faculty.objects.get(name=validated_data['faculty']),
                name=validated_data["name"],
                degree=validated_data['degree']
            )
            fof.save()
        except Exception:
            return False
        return True


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


class RecruitmentResultAggregateSerializer(serializers.ModelSerializer[Any]):
    candidates_count = serializers.SerializerMethodField()
    thresholds = serializers.SerializerMethodField()

    def get_recruitments_filters(self, obj: Any) -> Any:
        pass

    def get_candidates_count(self, obj: Any) -> int:
        recruitments = Recruitment.objects. \
            filter(**self.get_recruitments_filters(obj))
        return RecruitmentResult.objects \
            .filter(recruitment__in=recruitments) \
            .values_list('student', flat=True) \
            .distinct().count()

    def get_cycle_threshold(self, obj: Any, cycle: int) -> Any:
        recruitments_filters = self.get_recruitments_filters(obj)
        recruitments_filters['round'] = cycle
        recruitments = Recruitment.objects.filter(**recruitments_filters)
        recruitment_results = RecruitmentResult.objects.filter(
            recruitment__in=recruitments, result='Signed'
        )
        if recruitment_results:
            result = recruitment_results.aggregate(Min('points')). \
                get('points__min')
            return result
        return None

    def get_thresholds(self, obj: Any) -> Any:
        result = {}
        recruitments = Recruitment.objects \
            .filter(**self.get_recruitments_filters(obj))
        number_of_cycles = recruitments \
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


class FieldOfStudyCandidatesPerPlaceSerializer(
    RecruitmentResultFieldsOfStudySerializer
):
    places = serializers.SerializerMethodField()
    candidates_per_place = serializers.SerializerMethodField()
    year = serializers.SerializerMethodField()

    class Meta:
        model = FieldOfStudy
        fields = ('name', 'faculty', 'degree', 'year',
                  'candidates_count', 'places', 'candidates_per_place')

    def get_year(self, obj: FieldOfStudy) -> int:
        if 'year' not in self.context['request'].data:
            raise serializers.ValidationError("Year missing")
        else:
            return int(self.context['request'].data['year'])

    def get_places(self, obj: FieldOfStudy) -> Any:
        places = FieldOfStudyPlacesLimit.objects.filter(
            field_of_study=obj,
            year=self.get_year(obj)
        )
        return places[0].places if len(places) > 0 else None

    def get_candidates_per_place(self, obj: FieldOfStudy) -> Any:
        places = self.get_places(obj)
        if places is None:
            return None
        else:
            result = self.get_candidates_count(obj) / places
            return result


class RecruitmentResultOverviewSerializer(serializers.ModelSerializer[Any]):
    degree = serializers.SerializerMethodField()
    faculty = serializers. \
        ReadOnlyField(source='field_of_study.faculty.name')
    field_of_study = serializers. \
        ReadOnlyField(source='field_of_study.name')
    candidates_count = serializers.SerializerMethodField()
    signed_candidates_count = serializers.SerializerMethodField()
    contest_laureates_count = serializers.SerializerMethodField()

    class Meta:
        model = Recruitment
        fields = ('field_of_study', 'faculty', 'degree',
                  'year', 'round', 'candidates_count',
                  'signed_candidates_count',
                  'contest_laureates_count')

    def get_degree(self, obj: Recruitment) -> int:
        degree = obj.field_of_study.degree
        return 1 if degree == 6 or 7 else 2

    def get_candidates_count(self, obj: Recruitment) -> int:
        return RecruitmentResult.objects \
            .filter(recruitment=obj) \
            .values_list('student', flat=True) \
            .distinct().count()

    def get_signed_candidates_count(self, obj: Recruitment) -> int:
        return RecruitmentResult.objects \
            .filter(recruitment=obj, result='Signed') \
            .values_list('student', flat=True) \
            .distinct().count()

    def get_contest_laureates_count(self, obj: Recruitment) -> int:
        candidates = Candidate.objects \
            .exclude(contest__isnull=True) \
            .exclude(contest__exact='')
        return RecruitmentResult.objects \
            .filter(recruitment=obj, student__in=candidates) \
            .values_list('student', flat=True) \
            .distinct().count()


class UploadFieldOfStudySerializer(serializers.Serializer[Any]):
    file = serializers.FileField()

    class Meta:
        fields = 'file'

    def create(self, validated_data: Dict[str, Any]) -> Any:

        for line in validated_data["file"]:
            (degree, faculty_name, field_of_study_name, places,
             second_degree_field_of_study_name) = \
                line.decode("utf-8").strip().split(",")
            if (degree == '' or faculty_name == '' or
                field_of_study_name == '' or places == '') or \
                    ((int(degree) == 6 or int(degree) == 7)
                     and second_degree_field_of_study_name == '') or \
                    ((int(degree) == 8) and
                     second_degree_field_of_study_name != ''):
                return False

        for line in validated_data["file"]:
            (degree, faculty_name, field_of_study_name, places,
             second_degree_field_of_study_name) = \
                line.decode("utf-8").strip().split(",")

            faculty, _ = Faculty.objects.get_or_create(
                name=faculty_name
            )
            field_of_study, _ = FieldOfStudy.objects.get_or_create(
                faculty=faculty,
                name=field_of_study_name,
                degree=degree
            )
            field_of_study_places_limit, _ = \
                FieldOfStudyPlacesLimit.objects.update_or_create(
                    field_of_study=field_of_study,
                    year=validated_data['year'],
                    defaults={'places': places}
                )
            if int(degree) == 6 or int(degree) == 7:
                second_degree_field_of_study, _ = \
                    FieldOfStudy.objects.get_or_create(
                        faculty=faculty,
                        name=second_degree_field_of_study_name,
                        degree=8
                    )
                field_of_study_next_degree, _ = \
                    FieldOfStudyNextDegree.objects.update_or_create(
                        field_of_study=field_of_study,
                        year=validated_data['year'],
                        defaults={
                            'second_degree_field_of_study':
                                second_degree_field_of_study
                        }
                    )

        return True


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
                 city, school_city, school_type, school_name, graduade_faculty,
                 graduade_field_of_study, mode, grade_IT, grade_math,
                 grade_english, points_IT, points_math, points_english,
                 year, round, faculty_name, field_of_study_name,
                 points, result) = line.decode("utf-8").strip().split(",")

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
                                                       faculty_name,
                                                       field_of_study_name)

                recruitment = create_recruitment(
                    upload_request, field_of_study,
                    year, round)

                create_recruitment_result(upload_request,
                                          candidate, recruitment,
                                          points, result)

        except Exception as e:
            print(e)
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
                          faculty_name: str,
                          field_of_study_name: str) -> Any:
    faculty = Faculty.objects.get(name=faculty_name)
    field_of_study = FieldOfStudy.objects.get(
        faculty=faculty,
        name=field_of_study_name
    )
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
