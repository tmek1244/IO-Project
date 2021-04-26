from django.urls import path, re_path

from backend.views import (CompareFields, GetFacultiesView, GetFieldsOfStudy,
                           RecruitmentResultListView,
                           RecruitmentResultOverviewListView, UploadView)

app_name = 'backend'

urlpatterns = [
    path('recruitment-result/', RecruitmentResultListView.as_view(),
         name='recruitment_result_list'),
    path('recruitment-result-overview/',
         RecruitmentResultOverviewListView.as_view(),
         name='recruitment_result_overview_list'),
    path('upload/', UploadView.as_view(), name='upload_data'),
    path('faculties/', GetFacultiesView.as_view(), name='faculties'),
    path('fields_of_studies/',
         GetFieldsOfStudy.as_view(),
         name='fields_of_studies'),
    path('compere/', CompareFields.as_view(), name='compare'),
    re_path(r'^compare/(?P<string>.+)/$', CompareFields.as_view(),
            name='compare_fields')
]
