from django.urls import path

from .views import CreateUserView

app_name = "register"

urls_patterns = [
    path("", CreateUserView.as_view(), name="create_user")
]