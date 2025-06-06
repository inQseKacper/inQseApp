from django.core.management.base import BaseCommand
import pandas as pd
from api.models import Apartment, ApartmentsEarnings, Owner
from datetime import datetime, date

class Command(BaseCommand):
    help = "Import danych o apartamentach z pliku Excel"
    
    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help="Pełna ścieżka do pliku excela")
        parser.add_argument('month', type=str, help="Data miesiąca w formacie RRRR-MM-DD")
        
    def handle(self, *args, **kwargs):
        file_path = kwargs['file_path']
        df = pd.read_excel(file_path, sheet_name="Przychody per pokój")
        # print(df.columns.to_list())
        # print(df.head(20))
        month_str = kwargs.get('month')
        month = datetime.strptime(month_str, "%Y-%m-%d").date() if month_str else date.today()
        
        for index, row in df.iterrows():
            owner_name = row["Właściciel"]
            email = row["Email"]
            
            # pomijanie wierszy bez właściciela bądź emaila
            if pd.isna(owner_name) or str(owner_name).strip() == '' or pd.isna(email) or str(email).strip() == '':
                self.stdout.write(self.style.WARNING(f"⚠️ Pominięto wiersz {index + 2} – brak właściciela."))
                continue
            
            
            # tworzenie/pobieranie właściciela
            owner,_ = Owner.objects.get_or_create(
                full_name=owner_name,
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
                income=row['Przychód'],
                nights=row['Ilość noclegów'],
                occupancy=float(str(row['Obłożenie']).replace('%', '').replace(',', '.')),
                revpar=row['RevPAR'],
                for_owner=row['Dla właściciela'],
                month=month
            )
            
        self.stdout.write(self.style.SUCCESS("✅ Import zakończony."))