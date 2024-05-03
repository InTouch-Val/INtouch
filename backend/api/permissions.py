from rest_framework.permissions import SAFE_METHODS, IsAuthenticated, BasePermission


class IsAuthorOrReadOnly(IsAuthenticated):

    def has_object_permission(self, request, view, obj):
        """
        Return `True` if permission is granted, `False` otherwise.
        """
        return request.method in SAFE_METHODS or request.user == obj.author


class IsDoctorOnly(BasePermission):
    """Пермишн, дающий права только доктору."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == "doctor"

    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and request.user.user_type == "doctor"


class DoctorRelClient(BasePermission):
    """Пермишн, позволяющий доктору просматривать информацию только
    о его клиентах"""
    def has_permission(self, request, view):
        return request.user.is_staff

    def has_object_permission(self, request, view, obj):
        return ((request.user.is_authenticated and request.user.user_type == "doctor"
                and request.user.doctor.get(id) == obj.client.get(id))
                or (request.user.is_authenticated and request.user.user_type == "client"
                    and request.client.get(id) == obj.doctor.get(id)))
