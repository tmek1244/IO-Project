from typing import Any

from django.db import models

# Create your models here.


class Faculty(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self) -> Any:
        return str(self.name)
