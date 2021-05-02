from django.contrib.auth import get_user_model
from django.db import models

# Create your models here.


class Faculty(models.Model):
    name = models.CharField(max_length=150, unique=True)

    def __str__(self) -> str:
        return str(self.name)


class UploadRequest(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.DO_NOTHING,
                             null=True, blank=True)


class FieldOfStudy(models.Model):
    DEGREE = (
        ("1", "Bachelor"),
        ("2", "Master")
    )

    MODE = (
        ("stacjonarne", "stacjonarne"),
        ("niestacjonarne", "niestacjonarne")
    )

    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    degree = models.CharField(choices=DEGREE, max_length=10, null=True, blank=True, default="1")
    type = models.CharField(max_length=100, null=True, blank=True, default="stacjonarne")


class Candidate(models.Model):
    upload_request = models.ForeignKey(UploadRequest, on_delete=models.CASCADE,
                                       null=True, blank=True)
    pesel = models.CharField(max_length=50, null=True, blank=True)
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=50, null=True, blank=True)
    city = models.CharField(max_length=80, null=True, blank=True)
    contest = models.CharField(max_length=80, null=True, blank=True)

    class Meta:
        ordering = ('pesel','contest')

class GraduatedSchool(models.Model):
    SCHOOL_TYPE = (
        ('T', 'techikum'),
        ('L', 'liceum'),
        ('B', 'Bachelor')
    )
    upload_request = models.ForeignKey(UploadRequest, on_delete=models.CASCADE,
                                       null=True, blank=True)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    school_city = models.CharField(max_length=100, null=True, blank=True)
    school_type = models.CharField(choices=SCHOOL_TYPE, max_length=10)
    diploma_date = models.DateField(null=True, blank=True)
    school_name = models.CharField(max_length=100, null=True, blank=True)
    faculty = models.CharField(max_length=100, null=True, blank=True)
    field_of_study = models.CharField(max_length=100, null=True, blank=True)


class Grade(models.Model):
    upload_request = models.ForeignKey(UploadRequest, on_delete=models.CASCADE,
                                       null=True, blank=True)
    school = models.ForeignKey(GraduatedSchool, on_delete=models.CASCADE)
    subject = models.CharField(max_length=50)
    grade = models.FloatField()


class ExamResult(models.Model):
    upload_request = models.ForeignKey(UploadRequest, on_delete=models.CASCADE,
                                       null=True, blank=True)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    subject = models.CharField(max_length=50)
    result = models.FloatField()


class Recruitment(models.Model):
    upload_request = models.ForeignKey(UploadRequest, on_delete=models.CASCADE,
                                       null=True, blank=True)
    field_of_study = models.ForeignKey(FieldOfStudy, on_delete=models.CASCADE)
    year = models.IntegerField()
    round = models.IntegerField(default=1)


class RecruitmentResult(models.Model):
    POSSIBLE_RESULT = (
        ('+', 'Accepted'),
        ('-', 'Rejected'),
        ('$', 'Signed')
    )
    upload_request = models.ForeignKey(UploadRequest, on_delete=models.CASCADE,
                                       null=True, blank=True)
    student = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE)
    points = models.FloatField()
    result = models.CharField(max_length=150)


class Payment(models.Model):
    upload_request = models.ForeignKey(UploadRequest, on_delete=models.CASCADE,
                                       null=True, blank=True)
    student = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    payment = models.FloatField()
    description = models.TextField(null=True, blank=True)
    time = models.DateTimeField(null=True, blank=True)
