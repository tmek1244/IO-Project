from typing import Any

from rest_framework import serializers

from .models import (Candidate, Faculty, FieldOfStudy, Recruitment,
                     RecruitmentResult)


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
