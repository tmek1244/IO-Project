from typing import Any, Dict

from django.db.models import Model
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


class RecruitmentResultOverviewSerializer(serializers.ModelSerializer[Any]):
    cycle = serializers.\
        ReadOnlyField(source='recruitment.field_of_study.degree')
    year = serializers.ReadOnlyField(source='recruitment.year')
    recruitment_round = serializers.ReadOnlyField(source='recruitment.round')
    faculty = serializers.\
        ReadOnlyField(source='recruitment.field_of_study.degree.faculty.name')
    field_of_study = serializers.\
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
                (_, year, round,
                mode, degree, faculty_name, fof_name,
                result, points, olympiad, _,
                last_name, first_name, _, _, _, pesel, gender, date_of_birth,
                _, _, _, candidate_city, _, _, _, _,
                _, school_city, school_name, _, school_type, school_faculty, school_fof) = line.decode("utf-8").strip().split(",")

                candidate = create_candidate(
                    upload_request, pesel, first_name,
                    last_name, date_of_birth, gender,
                    candidate_city)

                create_graduaded_school(
                            upload_request, candidate, school_city,
                            school_type, school_name, school_faculty,
                            school_fof)

                fof = create_field_of_study(
                    upload_request, faculty_name, fof_name, mode, degree)

                recruitment = create_recruitment(
                            upload_request, fof, year, round)

                create_recruitment_result(
                    upload_request, candidate, recruitment,
                    points, result, olympiad)

        except Exception as e:
            print(e)
            upload_request.delete()
            return None

        return upload_request


def create_candidate(upload_request: Any, pesel: str, first_name: str, last_name: str,
                     date_of_birth: str, gender: str, city: str) -> Any:
    candidate, created = Candidate.objects.get_or_create(
        pesel=pesel,
        first_name=first_name,
        last_name=last_name,
        date_of_birth=date_of_birth,
        gender=gender,
        city=city
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


def create_field_of_study(faculty_name: str, field_of_study_name: str,
                          mode: str, degree: str) -> Any:
    faculty = Faculty.objects.get(name=faculty_name)
    field_of_study = FieldOfStudy.objects.get(
        faculty=faculty,
        name=field_of_study_name,
        mode=mode,
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
                              result: str, olympiad:str) -> Any:
    recruitment_result, created = RecruitmentResult.objects.get_or_create(
        student=candidate,
        recruitment=recruitment,
        points=points,
        result=result,
        olympiad=olympiad
    )
    if created:
        recruitment_result.upload_request = upload_request
        recruitment_result.save()
    return recruitment_result
