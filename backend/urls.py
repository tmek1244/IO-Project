from django.urls import path
from django.urls.conf import re_path

from .views import (GetFacultiesView, GetFieldsOfStudy,
                    RecruitmentResultListView,
                    RecruitmentResultOverviewListView, UploadView, get_basic_data)

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
    path('basic-data/', get_basic_data, name='get_basic_data'),
    re_path(r'^basic-data/(?P<match>.+)/$', get_basic_data, name='get_basic_data'),
]
