from django.urls import include, path, re_path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

from api.views import *

router = routers.DefaultRouter()
router.register("users", UserViewSet, basename="users")
router.register("assignments", AssignmentViewSet, basename="assignments")
router.register(
    "assignments-client", AssignmentClientViewSet, basename="assignments_client"
)
router.register("notes", NoteViewSet, basename="notes")
router.register("diary-notes", DiaryNoteViewSet, basename="diary_notes")
router.register("project-metrics", ProjectMetricsViewSet, basename="project_metrics")

urlpatterns = [
    path("", include(router.urls)),
    path("drf-auth/", include("rest_framework.urls")),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("get-user/", UserDetailsView.as_view(), name="user_details"),
    path(
        "confirm-email/<int:pk>/<str:token>/",
        UserConfirmEmailView.as_view(),
        name="confirm_email",
    ),
    path("password/reset/", PasswordResetRequestView.as_view(), name="password_reset"),
    path(
        "password/reset/confirm/<int:pk>/<str:token>/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "password/reset/complete/",
        PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
    path("user/update/<int:pk>/", UpdateUserView.as_view(), name="update_user"),
    path("user/update/password/", UpdatePasswordView.as_view(), name="update_password"),
    path("user/delete/", user_delete_hard, name="user_delete"),
    path("user/deactivate/", user_delete_soft, name="user_deactivate"),
    path(
        "assignments/add-list/<int:pk>/",
        AssignmentAddUserMyListView.as_view(),
        name="assignment_add-list",
    ),
    path(
        "assignments/delete-list/<int:pk>/",
        AssignmentDeleteUserMyListView.as_view(),
        name="assignment_delete-list",
    ),
    path(
        "assignments/set-client/<int:pk>/",
        AddAssignmentClientView.as_view(),
        name="add_assignment_client",
    ),
    path("clients/add/", AddClientView.as_view(), name="add_client"),
    path("update-client/<int:pk>/", UpdateClientView.as_view(), name="update_client"),
    path("client/delete/<int:pk>/", ClientDeleteView.as_view(), name="client_delete"),
    path(
        "client/update/<int:pk>/",
        DoctorUpdateClientView.as_view(),
        name="doctor_update_client",
    ),
    path("user/update/email/", UpdateEmailView.as_view(), name="update_email"),
    path(
        "user/update/email/confirm/<int:pk>/<str:token>/",
        UpdateEmailConfirmView.as_view(),
        name="update_email_confirm",
    ),
    re_path(
        r"project-metrics/(?P<for_whom>clients|therapists|growth)/download/",
        metrics_download,
        name="metrics_download",
    ),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "swagger/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger",
    ),
    path(
        "redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]
