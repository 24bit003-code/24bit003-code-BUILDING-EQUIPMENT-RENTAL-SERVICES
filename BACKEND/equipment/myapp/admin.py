from django.contrib import admin
from .models import *

admin.site.register(Customer)
admin.site.register(Equipment)
admin.site.register(Booking)
admin.site.register(Payment)
admin.site.register(Admin)

