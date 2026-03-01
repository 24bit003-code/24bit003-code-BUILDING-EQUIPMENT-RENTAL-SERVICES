from django.contrib import admin
from django.urls import path
from myapp import views
from .views import *


urlpatterns = [

    path('', homepage),

     # get customer by email
    path('get-customer/', get_customer_by_email),
    # Register customer (NEW)
    path('register-customer/', register_customer),
    # LOGIN CUSTOMER
    path('login-customer/', login_customer),
   
    # CRUD
    path('customers/', manage_customer),
    path('customers/<int:pk>/', manage_customer),

    path('equipment/', manage_equipment),
    path('equipment/<int:pk>/', manage_equipment),

    path('payment/', manage_payment),
    path('payment/<int:pk>/', manage_payment),

    path('booking/', manage_booking),
    path('booking/<int:pk>/', manage_booking),


    # login admin
    path('login-admin/', login_admin),
     # get admin by email
    path('get-admin/', get_admin_by_email),
    #update admin password
    path('admin/<int:id>/', update_admin_password),
]

