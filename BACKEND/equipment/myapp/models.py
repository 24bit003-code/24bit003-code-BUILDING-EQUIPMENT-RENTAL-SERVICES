from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=100, default='Customer')  
    email = models.EmailField(max_length=100, default='email.@gmail.com')  
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=100)  
    password = models.CharField(max_length=100) 
    age = models.CharField(max_length=3)

    def __str__(self):
        return self.name

class Admin(models.Model):
    name = models.CharField(max_length=100)  
    email = models.EmailField(max_length=100)    
    password = models.CharField(max_length=100) 

    def __str__(self):
        return self.name
    

class Equipment(models.Model):
    equipment_name = models.CharField(max_length=100)
    description = models.CharField(max_length=100)  
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='equipment_images/', null=True, blank=True)  

    def __str__(self):
        return self.equipment_name


class Booking(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, default='Pending')  

    def __str__(self):
        return self.status
    

class Payment(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_on = models.DateTimeField(auto_now_add=True, blank=True, null= True)
    method = models.CharField(max_length=50) 
    mobile_no = models.CharField(max_length=20)
 

    
    def __str__(self):
        return self.method
