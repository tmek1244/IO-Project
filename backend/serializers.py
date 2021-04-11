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
