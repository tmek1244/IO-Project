from django.contrib.auth.models import AbstractUser
from django.db import models

from backend.models import Faculty

# Create your models here.


class EmailUser(AbstractUser):
    email = models.EmailField(unique=True)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE,
                                blank=True, null=True)