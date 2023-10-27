from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView
from django.db.models import Q
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView

from .models import *
from .forms import *


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


class Community(ListView):
    model = User
    template_name = 'main/community.html'
    context_object_name = 'users'

    def get_queryset(self):
        queryset = User.objects.exclude(username=self.request.user.username)
        return queryset


class RegisterUser(CreateView):
    form_class = RegisterUserForm
    template_name = 'main/register.html'
    success_url = reverse_lazy('login')

    def form_valid(self, form):
        user = form.save()
        if user.user_type == 'doctor':
            Doctor.objects.create(user=user)
        else:
            Client.objects.create(user=user)
        login(self.request, user)
        return redirect('index')


class LoginUser(LoginView):
    form_class = AuthenticationForm
    template_name = 'main/login.html'


def logout_user(request):
    logout(request)
    return redirect('login')