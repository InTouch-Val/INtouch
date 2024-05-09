from rest_framework.permissions import SAFE_METHODS, BasePermission
from api.constants import USER_TYPES


class IsDoctorOnly(BasePermission):
    """Пермишн, дающий права только доктору."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == USER_TYPES[1]

    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and request.user.user_type == USER_TYPES[1]


class DoctorRelClient(BasePermission):
    """Пермишн, позволяющий доктору просматривать информацию только
    о его клиентах, а клиенту - только о его докторе."""

    def has_object_permission(self, request, view, obj):
        return (
            (request.user.is_authenticated and request.user.user_type == USER_TYPES[1]
             and obj.user_type == USER_TYPES[0]
             and request.user.doctor.clients.filter(id=obj.client.id).exists())
            or (request.user.id == obj.id)
            or (request.user.is_authenticated and request.user.user_type == USER_TYPES[0]
                and obj.user_type == USER_TYPES[1]
                and obj.doctor.clients.filter(id=request.user.id).exists())
        )


class IsStaffOnly(BasePermission):
    """Пермишн, дающий права только админам."""

    def has_permission(self, request, view):
        return request.user.is_staff


class IsOwnerOnly(BasePermission):
    """Пермишн, дающий права на редактирование учетки только самому юзеру."""

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return request.user.id == obj.id


class AssignmentAuthorOnly(BasePermission):
    """Пермишн, дающий права на операции над задачами только целевому
    клиенту или его доктору."""

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return (request.user.id == obj.user.id
                or request.user.doctor.clients.filter(id=obj.user.client.id).exists())


class AssignmentDiaryDoctorOnly(BasePermission):
    """Пермишн, дающий права на просмотр только докторам, а на
    редактирование - только автору задания и заметки"""

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return request.method in SAFE_METHODS or request.user == obj.author
