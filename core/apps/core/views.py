from django.shortcuts import render

from django.http import HttpResponse

def HTTPS(request):
    return HttpResponse("Server is running", status=200)