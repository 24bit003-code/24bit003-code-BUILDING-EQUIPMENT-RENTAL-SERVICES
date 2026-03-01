from decimal import Decimal

from django.core.management.base import BaseCommand

from myapp.models import Admin, Customer, Equipment, Payment


class Command(BaseCommand):
    help = "Seed demo data for production/local environments."

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Insert seed data even if records already exist.",
        )

    def handle(self, *args, **options):
        force = options["force"]

        if not force and Equipment.objects.exists() and Customer.objects.exists():
            self.stdout.write(self.style.WARNING("Seed skipped: data already exists."))
            return

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
            customer, _ = Customer.objects.get_or_create(
                email=email,
                defaults={
                    "name": name,
                    "phone": phone,
                    "address": address,
                    "password": password,
                    "age": age,
                },
            )
            customers.append(customer)

        equipment_seed = [
            ("Wheel Barrow", "Heavy-duty wheelbarrow for site transport", Decimal("15000.00"), "equipment_images/barrow.jpg"),
            ("Concrete Mixer", "Portable concrete mixer for construction", Decimal("85000.00"), "equipment_images/ConcreteMixer.jpg"),
            ("Excavator", "Excavator for digging and earthmoving", Decimal("250000.00"), "equipment_images/extravator_1.jpg"),
            ("Generator", "Backup generator for site power", Decimal("120000.00"), "equipment_images/Generator.jpg"),
            ("Power Drill", "Electric power drill for fastening and drilling", Decimal("25000.00"), "equipment_images/PowerDrill.jpg"),
            ("Ladder", "Industrial ladder for elevated work", Decimal("18000.00"), "equipment_images/leddar3.webp"),
            ("Saw Machine", "Cutting saw for wood/metal jobs", Decimal("30000.00"), "equipment_images/Saws.jpg"),
        ]

        created_equipment = []
        for name, description, price, image in equipment_seed:
            equipment, _ = Equipment.objects.get_or_create(
                equipment_name=name,
                defaults={
                    "description": description,
                    "price_per_day": price,
                    "image": image,
                },
            )
            changed = False
            if force or not equipment.image:
                equipment.image = image
                changed = True
            if force or not equipment.description:
                equipment.description = description
                changed = True
            if force or not equipment.price_per_day:
                equipment.price_per_day = price
                changed = True
            if changed:
                equipment.save()
            created_equipment.append(equipment)

        # Create at least 3 rentals per customer for dashboard visibility.
        if created_equipment:
            for idx, customer in enumerate(customers):
                current = Payment.objects.filter(customer=customer).count()
                needed = max(0, 3 - current)
                for i in range(needed):
                    eq = created_equipment[(idx + current + i) % len(created_equipment)]
                    Payment.objects.create(
                        customer=customer,
                        equipment=eq,
                        amount=eq.price_per_day,
                        method="Mpesa" if i % 2 == 0 else "Airtel Money",
                        mobile_no=customer.phone,
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete. Admin: {admin.email} | Customers: {Customer.objects.count()} | "
                f"Equipment: {Equipment.objects.count()} | Rentals: {Payment.objects.count()}"
            )
        )
