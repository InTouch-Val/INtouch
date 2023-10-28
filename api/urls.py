from django.urls import path, include
from rest_framework import routers

from .views import *


router = routers.DefaultRouter()
router.register('clients', ClientViewSet, basename='clients')
router.register('doctors', DoctorViewSet, basename='doctors')
router.register('users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
]