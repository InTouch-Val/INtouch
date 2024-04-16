from rest_framework.permissions import SAFE_METHODS, IsAuthenticated, BasePermission


class IsAuthorOrReadOnly(IsAuthenticated):

    def has_object_permission(self, request, view, obj):
        """
        Return `True` if permission is granted, `False` otherwise.
        """
        return request.method in SAFE_METHODS or request.user == obj.author


class IsDoctorUser(BasePermission):
    """Пермишн, дающий права только доктору."""
    def has_permission(self, request, view):
        return (request.user.is_authenticated and request.user.user_type == 'doctor')

    def has_object_permission(self, request, view, obj):
        return (request.user.is_authenticated and request.user.user_type == 'doctor')
