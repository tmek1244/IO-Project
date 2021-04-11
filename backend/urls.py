from django.urls import path

from .views import UploadView

app_name = 'backend'

urlpatterns = [
    path('upload/', UploadView.as_view(), name='upload_data'),
]
