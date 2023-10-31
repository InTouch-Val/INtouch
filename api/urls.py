from django.urls import path, include
from rest_framework import routers

from .views import *


router = routers.DefaultRouter()
router.register('clients', ClientViewSet, basename='clients')
router.register('doctors', DoctorViewSet, basename='doctors')
router.register('users', UserViewSet, basename='users')
router.register('assignments', AssignmentViewSet, basename='assignments')
router.register('massage', MassageViewSet, basename='massage')

urlpatterns = [
    path('', include(router.urls)),
    path('drf-auth/', include('rest_framework.urls')),
    path('login/', EmailLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]