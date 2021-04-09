from typing import Any, Dict

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

                graduated_school, created = \
                    GraduatedSchool.objects.get_or_create(
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

                grade, created = Grade.objects.get_or_create(
                    school=graduated_school,
                    subject="IT",
                    grade=grade_IT
                )
                if created:
                    grade.upload_request = upload_request
                    grade.save()

                grade, created = Grade.objects.get_or_create(
                    school=graduated_school,
                    subject="math",
                    grade=grade_math
                )
                if created:
                    grade.upload_request = upload_request
                    grade.save()

                grade, created = Grade.objects.get_or_create(
                    school=graduated_school,
                    subject="english",
                    grade=grade_english
                )
                if created:
                    grade.upload_request = upload_request
                    grade.save()

                exam_result, created = ExamResult.objects.get_or_create(
                    candidate=candidate,
                    subject="IT",
                    result=points_IT
                )
                if created:
                    exam_result.upload_request = upload_request
                    exam_result.save()

                exam_result, created = ExamResult.objects.get_or_create(
                    candidate=candidate,
                    subject="math",
                    result=points_math
                )
                if created:
                    exam_result.upload_request = upload_request
                    exam_result.save()

                exam_result, created = ExamResult.objects.get_or_create(
                    candidate=candidate,
                    subject="english",
                    result=points_english
                )
                if created:
                    exam_result.upload_request = upload_request
                    exam_result.save()

                field_of_study, created = FieldOfStudy.objects.get_or_create(
                    name=field_of_study_name
                )
                if created:
                    field_of_study.upload_request = upload_request
                    field_of_study.save()

                recruitment, created = Recruitment.objects.get_or_create(
                    field_of_study=field_of_study,
                    year=year,
                    round=round
                )
                if created:
                    recruitment.upload_request = upload_request
                    recruitment.save()

                recruitment_result, created = \
                    RecruitmentResult.objects.get_or_create(
                        student=candidate,
                        recruitment=recruitment,
                        points=points,
                        result=result
                    )
                if created:
                    recruitment_result.upload_request = upload_request
                    recruitment_result.save()

        except Exception:
            upload_request.delete()
            return None

        return upload_request
