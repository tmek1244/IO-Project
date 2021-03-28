from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import EmailUser

admin.site.register(EmailUser, UserAdmin)