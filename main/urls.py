from django.urls import path

from .views import *

urlpatterns = [
    path('', index, name='index'),
    path('clients/', Clients.as_view(), name='clients'),
    path('library/', AssignmentsLibrary.as_view(), name='library'),
    path('favorites/', AssignmentsFavorites.as_view(), name='favorites'),
    path('trash/', AssignmentsTrash.as_view(), name='trash'),
]
