from django.urls import path

from .views import UploadView, GetFacultiesView, GetFieldsOfStudy

app_name = 'backend'

urlpatterns = [    
    path('upload/', UploadView.as_view(), name='upload_data'),
    path('faculties/', GetFacultiesView.as_view(), name='faculties'),
    path('fields_of_studies/', GetFieldsOfStudy.as_view(), name='fields_of_studies'),
    
]
