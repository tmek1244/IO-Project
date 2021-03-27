from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse

# from django.shortcuts import render


# Create your views here.

def api(request: WSGIRequest) -> JsonResponse:
    return JsonResponse({"status": "ok"})
