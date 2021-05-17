from django.urls import path, re_path

from backend.views import (ActualFacultyThreshold, AddFacultyView,
                           AddFieldOfStudy, AvgAndMedOfFields,
                           CandidatesPerPlace, CompareFields,
                           FacultyPopularity, FacultyThreshold,
                           FieldConversionOverTheYearsView,
                           FieldOfStudyCandidatesPerPlaceListView,
                           FieldOfStudyContestLaureatesCountView, GetBasicData,
                           GetFacultiesView, GetFieldsOfStudy, GetMostLaureate,
                           GetThresholdOnField, LaureatesOnFOFSView,
                           RecruitmentResultFacultiesListView,
                           RecruitmentResultFieldsOfStudyListView,
                           RecruitmentResultListView,
                           RecruitmentResultOverviewListView,
                           RecruitmentStatusAggregateListView,
                           RecruitmentYears, StatusDistributionView,
                           UploadFieldsOfStudyView, UploadView)

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
    path('fields-of-study-candidates-per-place/',
         FieldOfStudyCandidatesPerPlaceListView.as_view(),
         name='fields_of_study_candidates_per_place'),
    path('upload/', UploadView.as_view(), name='upload_data'),
    path('upload/fields_of_study/<year>/',
         UploadFieldsOfStudyView.as_view(),
         name='upload_fields_of_study'),
    path('faculties/', GetFacultiesView.as_view(), name='faculties'),
    path('fields_of_studies/<degree>/',
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
    re_path(r'^candidates-per-place/(?P<string>.+)/$',
            CandidatesPerPlace.as_view(),
            name='candidates_per_place'),

    path('laureates-on-fofs/<faculty>/',
         LaureatesOnFOFSView.as_view(), name='laureates-on-fofs'),
    path('laureates-on-fofs/<faculty>/<int:year>/',
         LaureatesOnFOFSView.as_view(), name='laureates-on-fofs'),
    path('status-distribution/<int:year>/',
         StatusDistributionView.as_view(), name='status-distribution'),
    path('status-distribution/<int:year>/<faculty>/',
         StatusDistributionView.as_view(), name='status-distribution'),
    path('status-distribution/<int:year>/<faculty>/<degree>/',
         StatusDistributionView.as_view(), name='status-distribution'),
    re_path(r'^compare/(?P<string>.+)/$',
            CompareFields.as_view(), name='compare_fields'),
    re_path(r'^aam/(?P<degree>.+)/(?P<faculty_year_list>.+)/$',
            AvgAndMedOfFields.as_view(), name='get_avg_and_med_of_fileds'),
    path(
        r'actual_recruitment_faculty_threshold/faculty=<faculty>'
        r'&cycle=<degree>/',
        ActualFacultyThreshold.as_view(), name='actual_threshold'),
    re_path(
        r'^actual_recruitment_faculty_aggregation/faculty=(?P<faculty>.+)'
        r'&cycle=(?P<cycle>.+)$',
        RecruitmentStatusAggregateListView.as_view(),
        name='actual_recruitment'),
    path('available-years/', RecruitmentYears.as_view(),
         name='available_years'),
    path('faculty_threshold/<mode>/<degree>/<int:n>/<int:year>',
         FacultyThreshold.as_view(), name='faculty_threshold'),
    path('laureate_stats/<int:n>/<int:year>',
         GetMostLaureate.as_view(), name="laureate_stats"),
    path('faculty_popularity/<str:pop_type>/<str:degree>/<int:n>/<int:year>/',
         FacultyPopularity.as_view(), name="faculty_popularity"),
    path('field-conversion-over-the-years/',
         FieldConversionOverTheYearsView.as_view(),
         name='field-conversion'),
    path('field-conversion-over-the-years/<faculty>/',
         FieldConversionOverTheYearsView.as_view(),
         name='field-conversion'),
    path('field-conversion-over-the-years/<faculty>/<field_of_study>/',
         FieldConversionOverTheYearsView.as_view(),
         name='field-conversion'),
]
