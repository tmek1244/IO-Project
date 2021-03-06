from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.deletion import CASCADE, DO_NOTHING

# Create your models here.


class Faculty(models.Model):
    name = models.CharField(max_length=150, unique=True)

    def __str__(self) -> str:
        return str(self.name)


class UploadRequest(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=DO_NOTHING,
                             null=True, blank=True)


class FieldOfStudy(models.Model):
    DEGREE = (
        ("7", "7 terms I"),
        ("6", "6 terms I"),
        ("3", "3 terms II"),
        ("4", "4 terms II")
    )
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    degree = models.CharField(choices=DEGREE, max_length=10,
                              null=True, blank=True)


class FieldOfStudyPlacesLimit(models.Model):
    field_of_study = models.ForeignKey(FieldOfStudy, on_delete=models.CASCADE)
    year = models.IntegerField()
    places = models.IntegerField()


class FieldOfStudyNextDegree(models.Model):
    field_of_study = models.ForeignKey(FieldOfStudy, on_delete=models.CASCADE)
    year = models.IntegerField()
    second_degree_field_of_study = models.ForeignKey(
        FieldOfStudy,
        on_delete=models.CASCADE,
        related_name='second_degree_field_of_study'
    )


class Candidate(models.Model):
    upload_request = models.ForeignKey(UploadRequest, on_delete=CASCADE,
                                       null=True, blank=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=50)
    year_of_exam = models.IntegerField()
    city = models.CharField(max_length=80)
    contest = models.CharField(max_length=80, null=True)


class GraduatedSchool(models.Model):
    SCHOOL_TYPE = (
        ('T', 'techikum'),
        ('L', 'liceum'),
        ('S1L', 'studia 1 st licencjat'),
        ('S1I', 'studia 1 st inz'),
        ('S2M', 'studia 2 st'),
    )
    upload_request = models.ForeignKey(UploadRequest, on_delete=CASCADE,
                                       null=True, blank=True)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    school_city = models.CharField(max_length=100)
    school_type = models.CharField(choices=SCHOOL_TYPE, max_length=10)
    diploma_date = models.DateField(null=True, blank=True)
    school_name = models.CharField(max_length=100)
    faculty = models.CharField(max_length=100, null=True)
    field_of_study = models.CharField(max_length=100, null=True)
    # maybe add choices for mode
    mode = models.CharField(max_length=100, null=True)


class Grade(models.Model):
    upload_request = models.ForeignKey(UploadRequest, on_delete=CASCADE,
                                       null=True, blank=True)
    school = models.ForeignKey(GraduatedSchool, on_delete=models.CASCADE)
    subject = models.CharField(max_length=50)
    grade = models.FloatField()


class ExamResult(models.Model):
    upload_request = models.ForeignKey(UploadRequest, on_delete=CASCADE,
                                       null=True, blank=True)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    subject = models.CharField(max_length=50)
    result = models.FloatField()


class Recruitment(models.Model):
    upload_request = models.ForeignKey(UploadRequest, on_delete=CASCADE,
                                       null=True, blank=True)
    field_of_study = models.ForeignKey(FieldOfStudy, on_delete=models.CASCADE)
    year = models.IntegerField()
    round = models.IntegerField()


class RecruitmentResult(models.Model):
    POSSIBLE_RESULT = (
        ('+', 'Accepted'),
        ('-', 'Rejected'),
        ('$', 'Signed')
    )
    upload_request = models.ForeignKey(UploadRequest, on_delete=CASCADE,
                                       null=True, blank=True)
    student = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE)
    points = models.FloatField()
    result = models.CharField(choices=POSSIBLE_RESULT, max_length=10)


class Payment(models.Model):
    upload_request = models.ForeignKey(UploadRequest, on_delete=CASCADE,
                                       null=True, blank=True)
    student = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    payment = models.FloatField()
    description = models.TextField()
    time = models.DateTimeField()
