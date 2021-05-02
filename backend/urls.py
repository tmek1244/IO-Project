from django.urls import path, re_path

from backend.views import (AddFacultyView, AddFieldOfStudy,
                           FieldOfStudyContestLaureatesCountView, GetBasicData,
                           GetFacultiesView, GetFieldsOfStudy,
                           GetThresholdOnField, CompareFields,
                           RecruitmentResultFacultiesListView,
                           RecruitmentResultFieldsOfStudyListView,
                           RecruitmentResultListView,
                           RecruitmentResultOverviewListView, UploadView)

app_name = 'backend'

urlpatterns = [
    path('recruitment-result/', RecruitmentResultListView.as_view(),
         name='recruitment_result_list'),
    path('recruitment-result-overview/',
         RecruitmentResultOverviewListView.as_view(),
         name='recruitment_result_overview_list'),
    path('recruitment-result-faculties/',
         RecruitmentResultFacultiesListView.as_view(),
         name='recruitment_result_faculties_list'),
    path('recruitment-result-fields-of-study/',
         RecruitmentResultFieldsOfStudyListView.as_view(),
         name='recruitment_result_fields_of_study_list'),
    path('upload/', UploadView.as_view(), name='upload_data'),
    path('faculties/', GetFacultiesView.as_view(), name='faculties'),
    path('fields_of_studies/',
         GetFieldsOfStudy.as_view(),
         name='fields_of_studies'),
    path('add/faculty', AddFacultyView.as_view(), name='add_faculty'),
    path('add/field-of-study', AddFieldOfStudy.as_view(), name='add_fof'),
    path('basic-data/<string>/', GetBasicData.as_view(), name='basic_data'),
    path('threshold/', GetThresholdOnField.as_view(), name='threshold'),
    re_path(r'^threshold/(?P<string>.+)/$', GetThresholdOnField.as_view(),
            name='get_basic_data'),
    path('contest-laureates/',
         FieldOfStudyContestLaureatesCountView.as_view(),
         name='contest_laureates'),
    re_path(r'^contest-laureates/(?P<string>.+)/$',
            FieldOfStudyContestLaureatesCountView.as_view(),
            name='get_contest_laureates_count'),
    re_path(r'^compare/(?P<string>.+)/$',
            CompareFields.as_view(), name='compare_fields')
]
