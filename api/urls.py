from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
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
    path('user/delete/', user_delete_hard, name='user_delete'),
    path('user/deactivate/', user_delete_soft, name='user_deactivate'),
    path('assignments/add/', AddAssignmentView.as_view(), name='add_assignment'),
    path('assignments/', ListAssignmentView.as_view(), name='assignments'),
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
    path('assignments/<pk>/like/', AssignmentLikeView.as_view(), name='like'),
    path('assignments/<pk>/dislike/', AssignmentDislikeView.as_view(), name='dislike'),
    path('clients/add/', AddClientView.as_view(), name='add_client'),
    path('update-client/<int:pk>/', UpdateClientView.as_view(), name='update_client'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
