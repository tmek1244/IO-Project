from django.urls import path

from .views import RecruitmentResultListView

app_name = 'backend'

urlpatterns = [
    path('recruitment-result/', RecruitmentResultListView.as_view(),
         name='recruitment_result_list')
]
