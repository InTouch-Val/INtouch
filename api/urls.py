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
    path('confirm-email/<int:pk>/<str:token>/', UserConfirmEmailView.as_view(), name='confirm_email'),
    path('password/reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password/reset/confirm/<int:pk>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password/reset/complete/', PasswordResetCompleteView.as_view(), name='password_reset_complete')
]