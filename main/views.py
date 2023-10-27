from django.db.models import Q
from django.shortcuts import render, redirect
from django.views.generic import ListView

from .models import *


def index(request):
    return render(request, 'main/base.html')


class Clients(ListView):
    model = Client()
    template_name = 'main/clients.html'
    context_object_name = 'clients'

    def get_queryset(self):
        queryset = Client.objects.filter(doctor__user__pk=self.request.user.pk)
        return queryset


class AssignmentsLibrary(ListView):
    model = Assignment
    template_name = 'main/assignments.html'
    context_object_name = 'assignments'

    def get_queryset(self):
        queryset = Assignment.objects.filter(Q(author__user__pk=self.request.user.pk) & Q(category='library'))
        return queryset


class AssignmentsFavorites(ListView):
    model = Assignment
    template_name = 'main/assignments.html'
    context_object_name = 'assignments'

    def get_queryset(self):
        queryset = Assignment.objects.filter(Q(author__user__pk=self.request.user.pk) & Q(category='favorites'))
        return queryset


class AssignmentsTrash(ListView):
    model = Assignment
    template_name = 'main/assignments.html'
    context_object_name = 'assignments'

    def get_queryset(self):
        queryset = Assignment.objects.filter(Q(author__user__pk=self.request.user.pk) & Q(category='trash'))
        return queryset
