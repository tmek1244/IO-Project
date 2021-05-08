from typing import Any, Dict, List

from django.db.models import Manager

from backend.models import (Candidate, Faculty, FieldOfStudy, Recruitment,
                            RecruitmentResult)


class FieldListFilters:
    data: Dict[str, Any] = {}

    def __init__(self, data: Dict[str, str]):
        self.data = data
        self.faculty_name_filter = data.get("faculty")
        self.name_filter = data.get("field_of_study")
        self.degree_filter = data.get("study_cycle")

    def get_all_arguments(self) -> Dict[str, Any]:
        field_filters: Dict[str, Any] = {}
        if self.faculty_name_filter is not None:
            field_filters["faculty__in"] = Faculty.objects.filter(
                name=self.faculty_name_filter)

        if self.name_filter is not None:
            field_filters["name"] = self.name_filter

        if self.degree_filter is not None:
            field_of_study_filters["degree__in"] = (
                (6, 7) if self.degree_filter == 1 else 8)

        return field_filters


class RecruitmentResultListFilters:
    data: Dict[str, Any] = {}

    recruitment_filters: Dict[str, List[Any]] = {}
    second_degree_student_filters: Dict[str, List[Any]] = {}

    def __init__(self, data: Dict[str, str]):
        self.data = data
        self.recruitment_filters = self.get_recruitment_filters()
        self.second_degree_student_filters = (
            self.get_second_degree_student_filters())
        self.result_filter = data.get("status")

    def get_recruitment_filters(self) -> Dict[str, Any]:
        field_filters = (FieldListFilters(self.data).get_all_arguments())

        recruitment_filters = {}

        if len(field_filters) > 0:
            recruitment_filters["field_of_study__in"] = (
                FieldOfStudy.objects.filter(**field_filters))

        year = self.data.get("year")
        if year is not None:
            recruitment_filters["year"] = year

        recruitment_round = self.data.get("recruitment_round")
        if recruitment_round is not None:
            recruitment_filters["round"] = recruitment_round
        return recruitment_filters

    def get_second_degree_student_filters(self) -> Dict[str, Any]:
        student_filters = {}

        first_cycle_faculty = self.data.get("first_cycle_faculty")

        student_field_filters: Dict[str, Any] = {}
        if first_cycle_faculty is not None:
            student_field_filters["faculty__in"] = Faculty.objects.filter(
                name=first_cycle_faculty)
        first_cycle_field_of_study = (
            self.data.get("first_cycle_field_of_study"))
        if first_cycle_field_of_study is not None:
            student_field_filters["name"] = first_cycle_field_of_study

        student_recruitment_filters: Dict[str, Any] = {}
        if len(student_field_filters) > 0:
            student_field_filters["degree"] = 1
            student_recruitment_filters["field_of_study__in"] = (
                FieldOfStudy.objects.filter(**student_field_filters))
            student_recruitment_results_filters = {
                "recruitment__in":
                    Recruitment.objects.filter(**student_recruitment_filters)
            }
            student_ids = []
            for r in RecruitmentResult.objects.filter(
                    **student_recruitment_results_filters):
                student_ids.append(r.student.id)
            student_filters["id__in"] = student_ids

        return student_filters

    def get_all_arguments(self) -> Dict[str, Manager[Recruitment]]:
        filters: Dict[str, Any] = {}

        if len(self.recruitment_filters) > 0:
            filters["recruitment__in"] = Recruitment.objects.filter(
                **self.recruitment_filters)

        if len(self.second_degree_student_filters) > 0:
            filters["student__in"] = Candidate.objects.filter(
                **self.second_degree_student_filters)

        if self.result_filter is not None:
            filters["result"] = self.result_filter

        return filters
