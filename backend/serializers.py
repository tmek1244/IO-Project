from typing import Any, Dict

from django.db.models import Model
from rest_framework import serializers

from backend.models import (Candidate, ExamResult, FieldOfStudy, Grade,
                            GraduatedSchool, Recruitment, RecruitmentResult,
                            UploadRequest)


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
