from django.contrib import admin

from .models import *


admin.site.register(User)
admin.site.register(Doctor)
admin.site.register(Patient)
admin.site.register(Assignment)