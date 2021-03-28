from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (CreateUserView, CustomTokenObtainPairView, LogoutAllView,
                    LogoutView)

app_name = 'users'

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('logout_all/', LogoutAllView.as_view(), name='auth_logout_all'),
    path("register", CreateUserView.as_view(), name="create_user")
]
