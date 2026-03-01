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

        customer, _ = Customer.objects.get_or_create(
            email="demo@customer.com",
            defaults={
                "name": "Demo Customer",
                "phone": "0712345678",
                "address": "Dar es Salaam",
                "password": "12345",
                "age": "28",
            },
        )

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
            created_equipment.append(equipment)

        # Create at least 3 rentals for dashboard visibility.
        if created_equipment and (force or not Payment.objects.filter(customer=customer).exists()):
            current = Payment.objects.filter(customer=customer).count()
            needed = max(0, 3 - current)
            for i in range(needed):
                eq = created_equipment[(current + i) % len(created_equipment)]
                Payment.objects.create(
                    customer=customer,
                    equipment=eq,
                    amount=eq.price_per_day,
                    method="Mpesa",
                    mobile_no=customer.phone,
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete. Admin: {admin.email} | Customer: {customer.email} | "
                f"Equipment: {Equipment.objects.count()} | Rentals: {Payment.objects.count()}"
            )
        )

