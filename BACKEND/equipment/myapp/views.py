from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import *
from .serializers import *
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from decimal import Decimal

def normalize_credential(value):
    return (value or "").strip()


def ensure_demo_data():
    admin, _ = Admin.objects.get_or_create(
        email="admin@equipment.com",
        defaults={"name": "Main Admin", "password": "admin123"},
    )

    customers_seed = [
        ("Demo Customer", "demo@customer.com", "0712345678", "Dar es Salaam", "12345", "28"),
        ("Asha M", "asha@customer.com", "0711111111", "Arusha", "12345", "26"),
        ("John K", "john@customer.com", "0722222222", "Mwanza", "12345", "31"),
        ("Neema P", "neema@customer.com", "0733333333", "Dodoma", "12345", "24"),
    ]
    customers = []
    for name, email, phone, address, password, age in customers_seed:
        c, _ = Customer.objects.get_or_create(
            email=email,
            defaults={
                "name": name,
                "phone": phone,
                "address": address,
                "password": password,
                "age": age,
            },
        )
        customers.append(c)

    equipment_seed = [
        ("Wheel Barrow", "Heavy-duty wheelbarrow for site transport", Decimal("15000.00"), "equipment_images/barrow.jpg"),
        ("Concrete Mixer", "Portable concrete mixer for construction", Decimal("85000.00"), "equipment_images/ConcreteMixer.jpg"),
        ("Excavator", "Excavator for digging and earthmoving", Decimal("250000.00"), "equipment_images/extravator_1.jpg"),
        ("Generator", "Backup generator for site power", Decimal("120000.00"), "equipment_images/Generator.jpg"),
        ("Power Drill", "Electric power drill for fastening and drilling", Decimal("25000.00"), "equipment_images/PowerDrill.jpg"),
        ("Ladder", "Industrial ladder for elevated work", Decimal("18000.00"), "equipment_images/leddar3.webp"),
        ("Saw Machine", "Cutting saw for wood/metal jobs", Decimal("30000.00"), "equipment_images/Saws.jpg"),
    ]

    equipment_objs = []
    for name, desc, price, image in equipment_seed:
        eq, _ = Equipment.objects.get_or_create(
            equipment_name=name,
            defaults={"description": desc, "price_per_day": price, "image": image},
        )
        # Keep existing records in sync if they were created without images/details.
        changed = False
        if not eq.image:
            eq.image = image
            changed = True
        if not eq.description:
            eq.description = desc
            changed = True
        if not eq.price_per_day:
            eq.price_per_day = price
            changed = True
        if changed:
            eq.save()
        equipment_objs.append(eq)

    # Ensure rentals exist for dashboard/admin views.
    for idx, c in enumerate(customers):
        existing = Payment.objects.filter(customer=c).count()
        needed = max(0, 3 - existing)
        for i in range(needed):
            eq = equipment_objs[(idx + i) % len(equipment_objs)]
            Payment.objects.create(
                customer=c,
                equipment=eq,
                amount=eq.price_per_day,
                method="Mpesa" if i % 2 == 0 else "Airtel Money",
                mobile_no=c.phone,
            )

    return admin, customers[0]


# ================================
# HOMEPAGE
# ================================
def homepage(request):
    return HttpResponse("Welcome to Building Equipment Rental Service")


# ================================
# GENERIC CRUD FUNCTION
# ================================
def generic_api(model_class, serializer_class):
    """
    Generic CRUD API for any model and serializer.
    Handles GET (all or single), POST, PUT, DELETE.
    GET automatically filters by `customer` field if it exists.
    """

    @api_view(['GET', 'POST','PATCH', 'PUT', 'DELETE'])
    def api(request, pk=None):
        # Keep production usable even if database was freshly reset.
        if request.method == 'GET' and model_class in [Customer, Equipment, Payment]:
            ensure_demo_data()

        # -----------------------------
        # GET all or single
        # -----------------------------
        if request.method == 'GET':
            if pk:
                # If model has 'customer' field, filter by customer
                if 'customer' in [f.name for f in model_class._meta.get_fields()]:
                    objects = model_class.objects.filter(customer=pk)
                    serializer = serializer_class(objects, many=True)
                    return Response(serializer.data)
                else:
                    # fallback: get by id
                    try:
                        obj = model_class.objects.get(id=pk)
                        serializer = serializer_class(obj)
                        return Response(serializer.data)
                    except model_class.DoesNotExist:
                        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

            # No pk → return all objects
            objects = model_class.objects.all()
            serializer = serializer_class(objects, many=True)
            return Response(serializer.data)
        elif request.method == 'PATCH':
            if not pk:
                return Response({"detail": "Method PATCH requires pk"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                obj = model_class.objects.get(pk=pk)
                serializer = serializer_class(obj, data=request.data, partial=True)  # allow partial update
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except model_class.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        # -----------------------------
        # POST: create new object
        # -----------------------------
        elif request.method == 'POST':
            data = request.data.copy()

    # Convert equipment to integer ID
            if 'equipment' in data:
                try:
                    data['equipment'] = int(data['equipment'])
                except (TypeError, ValueError):
                    return Response(
                        {"detail": "Invalid equipment ID."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

    # Convert customer to integer ID
            if 'customer' in data:
                try:
                    data['customer'] = int(data['customer'])
                except (TypeError, ValueError):
                    return Response(
                        {"detail": "Invalid customer ID."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            serializer = serializer_class(data=data)
            if serializer.is_valid():
               serializer.save()
               return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # -----------------------------
        # PUT: update object
        # -----------------------------
        elif request.method == 'PUT':
            if not pk:
                return Response({"detail": "Method PUT requires pk"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                obj = model_class.objects.get(pk=pk)
                serializer = serializer_class(obj, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except model_class.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        # -----------------------------
        # DELETE: delete object
        # -----------------------------
        elif request.method == 'DELETE':
            if not pk:
                return Response({"detail": "Method DELETE requires pk"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                obj = model_class.objects.get(pk=pk)
                obj.delete()
                return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
            except model_class.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    return api


# ================================
# CUSTOMER REGISTER WITH EMAIL CHECK
# ================================
@api_view(['POST'])
def register_customer(request):
    email = request.data.get('email')

    if Customer.objects.filter(email=email).exists():
        return Response({
            "success": False,
            "message": "Customer already exists"
        }, status=status.HTTP_200_OK)

    data = request.data.copy()
    data['password'] = request.data.get('password')  # store as plain text (replace with hashing if needed)

    serializer = CustomerSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "success": True,
            "message": "Customer registered successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

    return Response({
        "success": False,
        "message": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


# ================================
# CUSTOMER LOGIN
# ================================
@api_view(['POST'])
def login_customer(request):
    ensure_demo_data()
    email = normalize_credential(request.data.get('email')).lower()
    password = normalize_credential(request.data.get('password'))

    try:
        customer = Customer.objects.get(email__iexact=email)
        if password == customer.password:
            return Response({
                "success": True,
                "message": "Login successful",
                "customer": {
                    "id": customer.id,
                    "name": customer.name,
                    "email": customer.email
                }
            })
        else:
            return Response({"success": False, "message": "Invalid Password or Email"})
    except Customer.DoesNotExist:
        return Response({"success": False, "message": "Customer not found"})
    except Exception as e:
        return Response(
            {"success": False, "message": f"Login error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ================================
# GET CUSTOMER BY EMAIL
# ================================
@csrf_exempt
def get_customer_by_email(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            if not email:
                return JsonResponse({"error": "Email not provided"}, status=400)

            customer = Customer.objects.get(email=email)
            return JsonResponse({
                "id": customer.id,
                "name": customer.name,
                "email": customer.email,
                "phone": customer.phone,
                "address": customer.address,
                "age": customer.age
            })
        except Customer.DoesNotExist:
            return JsonResponse({"error": "Customer not found"}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)


@csrf_exempt
def get_admin_by_email(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = normalize_credential(data.get("email")).lower()
            if not email:
                return JsonResponse({"error": "Email not provided"}, status=400)

            admin = Admin.objects.get(email__iexact=email)
            return JsonResponse({
                "id": admin.id,
                "name": admin.name,
                "email": admin.email,
                "password": admin.password,
                
            })
        except Admin.DoesNotExist:
            return JsonResponse({"error": "Admin not found"}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)



# ================================
# ADMIN LOGIN
# ================================
@api_view(['POST'])
def login_admin(request):
    ensure_demo_data()
    email = normalize_credential(request.data.get('email')).lower()
    password = normalize_credential(request.data.get('password'))

    # Ensure one usable admin exists in fresh local databases.
    if not Admin.objects.exists():
        Admin.objects.create(
            name="Main Admin",
            email="admin@equipment.com",
            password="admin123"
        )

    admin = Admin.objects.filter(email__iexact=email).first()
    if not admin:
        # Support login using admin name in addition to email.
        admin = Admin.objects.filter(name__iexact=email).first()

    if not admin:
        return Response({
            "success": False,
            "message": "Admin account haijapatikana. Tumia email sahihi, mfano: admin@equipment.com"
        })

    try:
        if password == admin.password:
            return Response({
                "success": True,
                "message": "Login successful",
                "admin": {
                    "id": admin.id,
                    "name": admin.name,
                    "email": admin.email
                }
            })

        return Response({
            "success": False,
            "message": "Password si sahihi kwa admin huyu."
        })
    except Exception as e:
        return Response(
            {"success": False, "message": f"Admin login error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Update admin password
@api_view(['PATCH'])
def update_admin_password(request, id):

    try:
        admin = Admin.objects.get(id=id)
    except Admin.DoesNotExist:
        return Response(
            {"error": "Admin not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = AdminSerializer(
        admin,
        data=request.data,
        partial=True   # IMPORTANT for PATCH
    )

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Password updated successfully"},
            status=status.HTTP_200_OK
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ================================
# CONNECT GENERIC CRUD TO MODELS
# ================================
manage_customer = generic_api(Customer, CustomerSerializer)
manage_equipment = generic_api(Equipment, EquipmentSerializer)
manage_payment = generic_api(Payment, PaymentSerializer)
manage_booking = generic_api(Booking, BookingSerializer)
