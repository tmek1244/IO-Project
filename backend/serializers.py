from typing import Any, Dict, Optional

from django.db.models import Model
from django.db.models.aggregates import Avg, Max, Min
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
        recruitments = Recruitment.objects.filter(
            **self.get_recruitments_filters(obj))
        return RecruitmentResult.objects.filter(
            recruitment__in=recruitments).values_list(
            'student', flat=True).distinct().count()

    def get_cycle_threshold(self, obj: Any, cycle: int) -> Any:
        recruitments_filters = self.get_recruitments_filters(obj)
        recruitments_filters['round'] = cycle
        recruitments = Recruitment.objects.filter(**recruitments_filters)
        recruitment_results = RecruitmentResult.objects.filter(
            recruitment__in=recruitments, result='Signed'
        )
        if recruitment_results:
            result = recruitment_results.aggregate(Min('points')).get(
                'points__min')
            return result
        return None

    def get_thresholds(self, obj: Any) -> Any:
        result = {}
        recruitments = Recruitment.objects.filter(
            **self.get_recruitments_filters(obj))
        number_of_cycles = recruitments.aggregate(
            Max('round')).get('round__max')
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
            field_of_studies_filters['degree'] = (
                self.context['request'].data['degree'])
        field_of_studies = FieldOfStudy.objects.filter(
            **field_of_studies_filters)
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
    candidates_per_place = serializers.SerializerMethodField()
    year = serializers.SerializerMethodField()

    class Meta:
        model = FieldOfStudy
        fields = ('name', 'faculty', 'degree', 'year',
                  'candidates_per_place')

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


class RecruitmentStatusAggregateSerializer(serializers.ModelSerializer[Any]):
    field_of_study = serializers.ReadOnlyField(source='field_of_study.name')
    recruitment_round = serializers.ReadOnlyField(source='round')
    treshold = serializers.SerializerMethodField()
    mean = serializers.SerializerMethodField()
    median = serializers.SerializerMethodField()
    candidates_no = serializers.SerializerMethodField()
    laureate_no = serializers.SerializerMethodField()
    signed_in = serializers.SerializerMethodField()
    not_signed_in = serializers.SerializerMethodField()
    resigned = serializers.SerializerMethodField()
    under_treshold = serializers.SerializerMethodField()

    class Meta:
        model = Recruitment
        fields = ('year', 'field_of_study', 'recruitment_round', 'treshold',
                  'mean', 'median', 'candidates_no', 'laureate_no',
                  'signed_in', 'not_signed_in', 'resigned', 'under_treshold')

    def get_treshold(self, obj: Recruitment) -> Any:
        recruitment_result_filters = {'recruitment': obj, 'result': 'signed'}
        recruitment_results = RecruitmentResult.objects.filter(
            **recruitment_result_filters)
        if recruitment_results:
            result = recruitment_results.aggregate(Min('points')).get(
                'points__min')
            return result
        return None

    def get_mean(self, obj: Recruitment) -> Any:
        recruitment_result_filters = {'recruitment': obj}
        recruitment_results = RecruitmentResult.objects.filter(
            **recruitment_result_filters)
        if recruitment_results:
            result = recruitment_results.aggregate(Avg('points')).get(
                'points__avg')
            return result
        return None

    def get_median(self, obj: Recruitment) -> Any:
        recruitment_result_filters = {'recruitment': obj}
        recruitment_results = RecruitmentResult.objects.filter(
            **recruitment_result_filters)
        count = recruitment_results.count()
        print(count)
        ordered_results = recruitment_results.values_list(
            'points', flat=True).order_by('points')
        if count == 0:
            return None
        if count % 2 == 0:
            return (ordered_results[int(count / 2)] +
                    ordered_results[int(count / 2) + 1]) / 2
        return ordered_results[int(count / 2)]

    def get_candidates_no(self, obj: Recruitment) -> int:
        return RecruitmentResult.objects.filter(
            recruitment=obj).values_list(
            'student', flat=True).distinct().count()

    def get_laureate_no(self, obj: Recruitment) -> int:
        candidates = Candidate.objects.exclude(
            contest__isnull=True).exclude(contest__exact='')
        return RecruitmentResult.objects.filter(
            recruitment=obj, student__in=candidates).values_list(
            'student', flat=True).distinct().count()

    def get_signed_in(self, obj: Recruitment) -> int:
        return RecruitmentResult.objects.filter(
            recruitment=obj, result='signed'
        ).count()

    def get_not_signed_in(self, obj: Recruitment) -> int:
        return RecruitmentResult.objects.filter(
            recruitment=obj).exclude(
            result='signed').count()

    def get_resigned(self, obj: Recruitment) -> int:
        return RecruitmentResult.objects.filter(
            recruitment=obj, result='unregistered'
        ).count()

    def get_under_treshold(self, obj: Recruitment) -> int:
        treshold = self.get_treshold(obj)
        try:
            return RecruitmentResult.objects.filter(
                recruitment=obj, points__lte=treshold
            ).count()
        except ValueError:
            return 0


class RecruitmentResultOverviewSerializer(serializers.ModelSerializer[Any]):
    degree = serializers.SerializerMethodField()
    faculty = serializers. \
        ReadOnlyField(source='field_of_study.faculty.name')
    field_of_study = serializers. \
        ReadOnlyField(source='field_of_study.name')
    candidates_per_place = serializers.SerializerMethodField()
    signed_in = serializers.SerializerMethodField()
    resigned = serializers.SerializerMethodField()
    not_signed_in = serializers.SerializerMethodField()
    under_treshold = serializers.SerializerMethodField()
    contest_laureates_count = serializers.SerializerMethodField()
    threshold = serializers.SerializerMethodField()
    mean = serializers.SerializerMethodField()
    median = serializers.SerializerMethodField()

    class Meta:
        model = Recruitment
        fields = ('field_of_study', 'faculty', 'degree',
                  'year', 'round', 'candidates_per_place',
                  'signed_in', 'resigned', 'not_signed_in',
                  'under_treshold', 'contest_laureates_count',
                  'threshold', 'mean', 'median')

    def get_degree(self, obj: Recruitment) -> Optional[str]:
        return str(obj.field_of_study.degree)

    def get_candidates_per_place(self, obj: Recruitment) -> Any:
        candidates = RecruitmentResult.objects.filter(
            recruitment=obj).values_list(
            'student', flat=True).distinct().count()
        places = FieldOfStudyPlacesLimit.objects.filter(
            field_of_study=obj.field_of_study,
            year=obj.year
        )
        if len(places) > 0:
            return round(candidates / places[0].places, 2)
        return None

    def get_signed_in(self, obj: Recruitment) -> int:
        return RecruitmentResult.objects.filter(
            recruitment=obj,
            result='signed').values_list(
            'student', flat=True).distinct().count()

    def get_resigned(self, obj: Recruitment) -> int:
        return RecruitmentResult.objects.filter(
            recruitment=obj,
            result='unregistered').values_list(
            'student', flat=True).distinct().count()

    def get_not_signed_in(self, obj: Recruitment) -> int:
        return RecruitmentResult.objects.filter(
            recruitment=obj,
            result='accepted').values_list(
            'student', flat=True).distinct().count()

    def get_under_treshold(self, obj: Recruitment) -> Any:
        threshold = self.get_threshold(obj)
        if threshold is None:
            return None
        return RecruitmentResult.objects.filter(
            recruitment=obj,
            points__lt=self.get_threshold(obj)
        ).values_list('student', flat=True).distinct().count()

    def get_contest_laureates_count(self, obj: Recruitment) -> Any:
        degree = self.get_degree(obj)
        if degree is not None:
            degree_value: int = int(degree)
            if degree_value == 2:
                return None
        candidates = Candidate.objects.exclude(
            contest__isnull=True).exclude(contest__exact='')
        return RecruitmentResult.objects.filter(
            recruitment=obj,
            student__in=candidates).values_list(
            'student', flat=True).distinct().count()

    def get_threshold(self, obj: Recruitment) -> Any:
        recruitment_results = RecruitmentResult.objects.filter(
            recruitment=obj,
            result='signed'
        )
        if recruitment_results:
            result = recruitment_results.aggregate(Min('points')).get(
                'points__min')
            return result
        return None

    def get_mean(self, obj: Recruitment) -> Any:
        recruitment_results = RecruitmentResult.objects.filter(
            recruitment=obj
        )
        if recruitment_results:
            result = recruitment_results.aggregate(Avg('points')).get(
                'points__avg')
            return result
        return None

    def get_median(self, obj: Recruitment) -> Any:
        recruitment_results = RecruitmentResult.objects.filter(
            recruitment=obj
        )
        count = recruitment_results.count()
        ordered_results = recruitment_results.values_list(
            'points', flat=True).order_by('points')
        if count == 0 or len(ordered_results) == 0:
            return None
        if count == 1:
            return ordered_results[0]
        if count == 2:
            return (ordered_results[0] + ordered_results[1]) / 2
        if count % 2 == 0:
            return (ordered_results[int(count / 2)] +
                    ordered_results[int(count / 2) + 1]) / 2
        return ordered_results[int(count / 2)]


class UploadFieldOfStudySerializer(serializers.Serializer[Any]):
    file = serializers.FileField()

    class Meta:
        fields = 'file'

    def create(self, validated_data: Dict[str, Any]) -> Any:

        for line in validated_data["file"]:
            (degree, faculty_name, field_of_study_name, places,
             second_degree_field_of_study_name) = (
                line.decode("utf-8").strip().split(","))
            if (degree == '' or faculty_name == '' or
                field_of_study_name == '' or places == '') or (
                    ((int(degree) == 2) and
                     second_degree_field_of_study_name != '')):
                return False

        for line in validated_data["file"]:
            (degree, faculty_name, field_of_study_name, places,
             second_degree_field_of_study_name) = (
                line.decode("utf-8").strip().split(","))

            faculty, _ = Faculty.objects.get_or_create(
                name=faculty_name
            )
            field_of_study, _ = FieldOfStudy.objects.get_or_create(
                faculty=faculty,
                name=field_of_study_name,
                degree=degree
            )
            field_of_study_places_limit, _ = (
                FieldOfStudyPlacesLimit.objects.update_or_create(
                    field_of_study=field_of_study,
                    year=validated_data['year'],
                    defaults={'places': places}
                ))
            if second_degree_field_of_study_name != '':
                second_degree_field_of_study, _ = (
                    FieldOfStudy.objects.get_or_create(
                        faculty=faculty,
                        name=second_degree_field_of_study_name,
                        degree=2
                    ))
                field_of_study_next_degree, _ = (
                    FieldOfStudyNextDegree.objects.update_or_create(
                        field_of_study=field_of_study,
                        year=validated_data['year'],
                        defaults={
                            'second_degree_field_of_study':
                                second_degree_field_of_study
                        }
                    ))

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
                (
                    _, year, round,
                    mode, degree, faculty_name, fof_name,
                    result, points, contest, _,
                    last_name, first_name, _, _, _, pesel, gender,
                    date_of_birth, _, _, _, candidate_city, _, _, _, _,
                    _, school_city, school_name, _, school_type,
                    school_faculty, school_fof
                ) = line.decode("utf-8").strip().split(",")

                candidate = create_candidate(
                    upload_request, pesel, first_name,
                    last_name, date_of_birth, gender,
                    candidate_city, contest)

                create_graduaded_school(
                            upload_request, candidate, school_city,
                            school_type, school_name, school_faculty,
                            school_fof)

                fof = get_field_of_study(
                    faculty_name, fof_name, mode, degree)

                recruitment = create_recruitment(
                            upload_request, fof, year, round)

                create_recruitment_result(
                    upload_request, candidate, recruitment,
                    points, result)

        except Exception as e:
            print(e)
            upload_request.delete()
            return None

        return upload_request


def create_candidate(
        upload_request: Any, pesel: str, first_name: str, last_name: str,
        date_of_birth: str, gender: str, city: str, contest: str) -> Any:
    candidate, created = Candidate.objects.get_or_create(
        pesel=pesel,
        first_name=first_name,
        last_name=last_name,
        date_of_birth=date_of_birth,
        gender=gender,
        city=city,
        contest=contest
    )
    if created:
        candidate.upload_request = upload_request
        candidate.save()
    return candidate


def create_graduaded_school(upload_request: Any, candidate: Model,
                            school_city: str, school_type: str,
                            school_name: str, graduade_faculty: str,
                            graduade_field_of_study: str) -> Any:
    graduated_school, created = GraduatedSchool.objects.get_or_create(
            candidate=candidate,
            school_city=school_city,
            school_type=school_type,
            school_name=school_name,
            faculty=graduade_faculty,
            field_of_study=graduade_field_of_study
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


def get_field_of_study(faculty_name: str, field_of_study_name: str,
                       mode: str, degree: str) -> Any:
    faculty = Faculty.objects.get(name=faculty_name)
    field_of_study = FieldOfStudy.objects.get(
        faculty=faculty,
        name=field_of_study_name,
        type=mode,
        degree=degree,
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
