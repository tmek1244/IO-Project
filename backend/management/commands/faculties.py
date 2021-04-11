from typing import Any, Dict, List, Tuple

from django.core.management.base import BaseCommand

from backend.models import Faculty, FieldOfStudy

FACULTIES: Dict[str, List[Tuple[str, str]]] = {
    'WIET': [('Informatyka', '7'), ('Elektornika', '7')],
    'WO': [('Odlewnictwo', '7'),
           ('Komputerowe Wspomaganie Procesów Inżynierskich', '7')],
    'WFIS': [('Fizyka Techniczna', '6'), ('Informatyka Stosowana', '7')]
}


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args: Any, **kwargs: Any) -> None:
        self.stdout.write("DZIALA")

        for faculty_name, fields in FACULTIES.items():
            faculty, created = Faculty.objects.get_or_create(
                name=faculty_name
            )

            for field in fields:
                FieldOfStudy.objects.get_or_create(
                    faculty=faculty,
                    name=field[0],
                    degree=field[1]
                )
