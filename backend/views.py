from django.core.handlers.wsgi import WSGIRequest
from django.db.models import Manager
from django.http import JsonResponse
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from backend.filters import RecruitmentResultListFilters
from backend.models import RecruitmentResult
from backend.serializers import RecruitmentResultSerializer

# Create your views here.
# from django.shortcuts import render


def api(request: WSGIRequest) -> JsonResponse:
    return JsonResponse({"status": "ok"})


class RecruitmentResultListView(generics.ListAPIView):
    queryset = RecruitmentResult.objects.all()
    serializer_class = RecruitmentResultSerializer

    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> Manager[RecruitmentResult]:
        filters = RecruitmentResultListFilters(self.request.data) \
            .get_all_arguments()

        return RecruitmentResult.objects.filter(**filters) \
            if len(filters) > 0 else RecruitmentResult.objects.all()
