from typing import Any, Dict, List, Tuple

from django.core.management.base import BaseCommand

from backend.models import Faculty, FieldOfStudy
from django.contrib.auth import get_user_model

import sys
sys.path.insert(0,'....') 

import generate_data

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args: Any, **kwargs: Any) -> None:
        fofs = generate_data.FieldOfStudy.fofs

        faculties = list(set(t[0] for t in fofs))

        for faculty in faculties:
            Faculty.objects.get_or_create(name=faculty)[0].save()

        for faculty, fof in fofs:
            FieldOfStudy.objects.get_or_create(
                faculty=Faculty.objects.get(name=faculty),
                name=fof,
                degree="1", type="stacjonarne"
            )[0].save()
            FieldOfStudy.objects.get_or_create(
                faculty=Faculty.objects.get(name=faculty),
                name=fof,
                degree="2", type="stacjonarne"
            )[0].save()
            FieldOfStudy.objects.get_or_create(
                faculty=Faculty.objects.get(name=faculty),
                name=fof,
                degree="1", type="niestacjonarne"
            )[0].save()
            FieldOfStudy.objects.get_or_create(
                faculty=Faculty.objects.get(name=faculty),
                name=fof,
                degree="2", type="niestacjonarne"
            )[0].save()
            if not get_user_model().objects.filter(username='admin').exists():
                get_user_model().objects.create_superuser(
                    username="admin",
                    email="admin@admin.com",
                    password="admin"
                )