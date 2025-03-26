from django.core.management.base import BaseCommand
import pandas as pd
from api.models import Apartment, ApartmentsEarnings, Owner

class Command(BaseCommand):
    help = "Import danych o apartamentach z pliku Excel"
    
    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help="Pełna ścieżka do pliku excela")
        
    def handle(self, *args, **kwargs):
        file_path = kwargs['file_path']
        df = pd.read_excel(file_path)
        
        for index, row in df.iterrows():
            owner_name = row["Właściciel"]
            
            # pomijanie wierszy bez właściciela
            if pd.isna(owner_name) or str(owner_name).strip() == '':
                self.stdout.write(self.style.WARNING(f"⚠️ Pominięto wiersz {index + 2} – brak właściciela."))
                continue
            
            email = f"{owner_name.lower().replace(' ', '_')}@brakemaila.com"
            
            # tworzenie/pobieranie właściciela
            owner,_ = Owner.objects.get_or_create(
                name=owner_name,
                email=email
                )
            
            # tworzenie apartamentu
            apartment,_ = Apartment.objects.get_or_create(
                room_name = row["Pokój"],
                owner = owner
            )
            
            # tworzenie danych finansowych
            ApartmentsEarnings.objects.create(
                apartment=apartment,
                income=row['Przychów'],
                nights=row['Ilość noclegów'],
                occupancy=float(str(row['Obłożenie']).replace('%', '').replace(',', '.')),
                revpar=row['RevPAR'],
                for_owner=row['Dla właściciela']
            )
            
        self.stdout.write(self.style.SUCCESS("✅ Import zakończony."))