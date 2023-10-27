from django.urls import path

from .views import *

urlpatterns = [
    path('', index, name='index'),
    path('clients/', Clients.as_view(), name='clients'),
    path('library/', AssignmentsLibrary.as_view(), name='library'),
    path('favorites/', AssignmentsFavorites.as_view(), name='favorites'),
    path('trash/', AssignmentsTrash.as_view(), name='trash'),
    path('community/', Community.as_view(), name='community'),
    path('login/', LoginUser.as_view(), name='login'),
    path('logout/', logout_user, name='logout'),
    path('register/', RegisterUser.as_view(), name='register'),
]
