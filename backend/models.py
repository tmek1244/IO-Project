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


class Yearbook(models.Model):
    field_of_study = models.ForeignKey(FieldOfStudy, on_delete=models.CASCADE)
    begin = models.DateField()
    end = models.DateField()
    available_capacity = models.IntegerField()
    minimal_points = models.FloatField()


class Candidate(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=50)
    year_of_exam = models.IntegerField()
    city = models.CharField(max_length=80)
    school = models.CharField(max_length=150)


class Graduate(models.Model):
    student = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    yearbook = models.ForeignKey(Yearbook, on_delete=models.CASCADE)
    grade = models.FloatField()


class Recruitment(models.Model):
    field_of_study = models.ForeignKey(FieldOfStudy, on_delete=models.CASCADE)
    year = models.IntegerField()
    round = models.IntegerField()


class RecruitmentResult(models.Model):
    POSSIBLE_RESULT = (
        ('+', 'Accepted'),
        ('-', 'Rejected'),
        ('?', 'Waiting'),
        ('$', 'Resigned')
    )
    student = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE)
    points = models.FloatField()
    result = models.CharField(choices=POSSIBLE_RESULT)


class Semester(models.Model):
    student = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    yearbook = models.ForeignKey(Yearbook, on_delete=models.CASCADE)
    semester_type = models.IntegerField()


class Payment(models.Model):
    student = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    payment = models.FloatField()
    description = models.TextField()
    time = models.DateTimeField()
