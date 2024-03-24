from rest_framework.permissions import SAFE_METHODS, IsAuthenticated


class IsAuthorOrReadOnly(IsAuthenticated):

    def has_object_permission(self, request, view, obj):
        """
        Return `True` if permission is granted, `False` otherwise.
        """
        return request.method in SAFE_METHODS or request.user == obj.author
