from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.deletion import DO_NOTHING
from django.db.models.fields.related import ForeignKey

# Create your models here.


class Faculty(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self) -> str:
        return str(self.name)

class UploadRequest(models.Model):
    user = ForeignKey(get_user_model(), on_delete=DO_NOTHING, null=True, blank=True)
