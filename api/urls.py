from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import *

router = routers.DefaultRouter()
router.register('users', UserViewSet, basename='users')
router.register('massage', MassageViewSet, basename='massage')

urlpatterns = [
    path('', include(router.urls)),
    path('drf-auth/', include('rest_framework.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path(
        'confirm-email/<int:pk>/<str:token>/',
        UserConfirmEmailView.as_view(),
        name='confirm_email'
    ),
    path('assignments/', ListAssignmentView.as_view(), name='list_assignment'),
    path('assignments/add/', AddAssignmentView.as_view(), name='add_assignment'),
    path(
        'assignments/<int:pk>/<int:user_pk>/add/',
        AssignmentAddUserMyListView.as_view(),
        name='assignment_add_user'
    ),
    path(
        'assignments/<int:pk>/<int:user_pk>/delete/',
        AssignmentDeleteUserMyListView.as_view(),
        name='assignment_delete_user'
    ),
    path('assignments/<pk>/like/', AssignmentLikeView.as_view(), name='like'),
    path('assignments/<pk>/dislike/', AssignmentDislikeView.as_view(), name='dislike'),
    path('clients/', ClientListView.as_view(), name='clients'),
    path('clients/add/', AddClientView.as_view(), name='add_client'),
    path(
        'password/reset/',
        PasswordResetRequestView.as_view(),
        name='password_reset'
    ),
    path(
        'password/reset/confirm/<int:pk>/<str:token>/',
        PasswordResetConfirmView.as_view(),
        name='password_reset_confirm'
    ),
    path(
        'password/reset/complete/',
        PasswordResetCompleteView.as_view(),
        name='password_reset_complete'
    )
]
