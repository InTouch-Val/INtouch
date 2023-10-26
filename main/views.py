from django.shortcuts import render, redirect

from main.forms import *


def index(request):
    return render(request, 'main/base.html')