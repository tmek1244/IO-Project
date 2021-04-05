from django.db import models


# Create your models here.


class Faculty(models.Model):
    name = models.CharField(max_length=150)


class FieldOfStudy(models.Model):
    DEGREE = (
        ("7", "7 terms I"),
        ("6", "6 terms I"),
        ("3", "3 terms II"),
        ("4", "4 terms II")
    )
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    degree = models.CharField(choices=DEGREE)


class Candidate(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=50)
    year_of_exam = models.IntegerField()
    city = models.CharField(max_length=80)


class GraduatedSchool(models.Model):
    SCHOOL_TYPE = (
        ('T', 'techikum'),
        ('L', 'liceum'),
        ('S1L', 'studia 1 st licencjat'),
        ('S1I', 'studia 1 st inz'),
        ('S2M', 'studia 2 st'),
    )
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    school_city = models.CharField(max_length=100)
    school_type = models.CharField(choices=SCHOOL_TYPE)
    diploma_date = models.DateField()
    school_name = models.CharField(max_length=100)
    faculty = models.CharField(max_length=100, null=True)
    field_of_study = models.CharField(max_length=100, null=True)
    # maybe add choices for mode
    mode = models.CharField(max_length=100, null=True)


class Grade(models.Model):
    school = models.ForeignKey(GraduatedSchool, on_delete=models.CASCADE)
    subject = models.CharField(max_length=50)
    grade = models.FloatField()


class ExamResult(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    subject = models.CharField(max_length=50)
    result = models.FloatField()


class Recruitment(models.Model):
    field_of_study = models.ForeignKey(FieldOfStudy, on_delete=models.CASCADE)
    year = models.IntegerField()
    round = models.IntegerField()


class RecruitmentResult(models.Model):
    POSSIBLE_RESULT = (
        ('+', 'Accepted'),
        ('-', 'Rejected'),
        ('$', 'Signed')
    )
    student = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE)
    points = models.FloatField()
    result = models.CharField(choices=POSSIBLE_RESULT)


class Payment(models.Model):
    student = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    payment = models.FloatField()
    description = models.TextField()
    time = models.DateTimeField()
