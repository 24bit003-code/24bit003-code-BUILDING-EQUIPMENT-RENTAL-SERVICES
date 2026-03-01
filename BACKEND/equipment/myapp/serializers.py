# myapp/serializers.py
from rest_framework import serializers
from .models import Customer, Equipment, Booking, Payment,Admin

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__' 


# myapp/serializers.py
class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = '__all__' 

# myapp/serializers.py
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'  

# myapp/serializers.py
class PaymentSerializer(serializers.ModelSerializer):
    paid_on = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    equipment = serializers.PrimaryKeyRelatedField(queryset=Equipment.objects.all())
    class Meta:
        model = Payment
        fields = '__all__'  # Include all fields of the Payment model


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'  # Include all fields of the Payment model



