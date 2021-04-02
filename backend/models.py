from django.db import models

# Create your models here.


class Faculty(models.Model):
    name = models.CharField(max_length=150)


class FieldOfStudy(models.Model):
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    degree = models.IntegerField()


class Yearbook(models.Model):
    field_of_study = models.ForeignKey(FieldOfStudy, on_delete=models.CASCADE)
    begin = models.DateField()
    end = models.DateField()
    available_capacity = models.IntegerField()


class Student(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=50)
    year_of_exam = models.IntegerField()
    city = models.CharField(max_length=80)


class Graduate(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
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
        ('?', 'Waiting')
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    recruitment = models.ForeignKey(Recruitment, on_delete=models.CASCADE)
    points = models.FloatField()
    result = models.CharField(choices=POSSIBLE_RESULT)


class Semester(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    yearbook = models.ForeignKey(Yearbook, on_delete=models.CASCADE)
    semester_type = models.IntegerField()


class Payment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    payment = models.FloatField()
    description = models.TextField()
    time = models.DateTimeField()
