from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import *

router = routers.DefaultRouter()
router.register('users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('drf-auth/', include('rest_framework.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('get-user/', UserDetailsView.as_view(), name='user_details'),
    path(
        'confirm-email/<int:pk>/<str:token>/',
        UserConfirmEmailView.as_view(),
        name='confirm_email'
    ),
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
    ),
    path('user/update/<int:pk>/', UpdateUserView.as_view(), name='update_user'),
    path('user/update/password/', UpdatePasswordView.as_view(), name='update_password'),
    path('user/delete/', user_delete_hard, name='user_delete'),
    path('user/deactivate/', user_delete_soft, name='user_deactivate'),
    path('assignments/add/', AddAssignmentView.as_view(), name='add_assignment'),
    path('assignments/', ListAssignmentView.as_view(), name='assignments'),
    path('assignments-client/', ListAssignmentClientView.as_view(), name='assignments-client'),
    path('assignments/<int:pk>/', AssignmentDetailView.as_view(), name='assignment_detail'),
    path(
        'assignments/add-list/<int:pk>/',
        AssignmentAddUserMyListView.as_view(),
        name='assignment_add-list'
    ),
    path(
        'assignments/delete-list/<int:pk>/',
        AssignmentDeleteUserMyListView.as_view(),
        name='assignment_delete-list'
    ),
    path(
        'assignments/set-client/<int:pk>/<int:client_pk>/',
        AddAssignmentClientView.as_view(),
        name='add_assignment_client'
    ),
    # path('assignments/<pk>/like/', AssignmentLikeView.as_view(), name='like'),
    # path('assignments/<pk>/dislike/', AssignmentDislikeView.as_view(), name='dislike'),
    path('clients/add/', AddClientView.as_view(), name='add_client'),
    path('update-client/<int:pk>/', UpdateClientView.as_view(), name='update_client'),
    path('client/delete/<int:pk>/', ClientDeleteView.as_view(), name='client_delete'),
    path('client/update/<int:pk>/', DoctorUpdateClientView.as_view(), name='doctor_update_client')
]
