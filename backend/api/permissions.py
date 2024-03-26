from rest_framework import permissions


class IsConfirmedUser(permissions.BasePermission):
    """Пермишн, дающий права авторизованным пользователям и пользователям,
    прошедшим двухфакторную авторизацию."""
    def has_permission(self, request, view):
        return ((request.user.is_authenticated
                and request.user.double_auth is False)
                or (request.user.double_auth
                and request.user.confirmation_code.is_confirmed)
                )

    def has_object_permission(self, request, view, obj):
        return ((request.user.is_authenticated
                and request.user.double_auth is False)
                or (request.user.double_auth
                and request.user.confirmation_code.is_confirmed)
                )
