from django.contrib import admin

from .models import (Candidate, ExamResult, Faculty, FieldOfStudy, Grade,
                     GraduatedSchool, Payment, Recruitment, RecruitmentResult,
                     UploadRequest)

# Register your models here.


admin.site.register(Faculty)
admin.site.register(UploadRequest)
admin.site.register(Candidate)
admin.site.register(FieldOfStudy)
admin.site.register(GraduatedSchool)
admin.site.register(Grade)
admin.site.register(ExamResult)
admin.site.register(Recruitment)
admin.site.register(RecruitmentResult)
admin.site.register(Payment)
