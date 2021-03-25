from django.urls import path
from .views import CustomTokenObtainPairView, LogoutView, LogoutAllView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

app_name = 'users'

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('logout_all/', LogoutAllView.as_view(), name='auth_logout_all')
]