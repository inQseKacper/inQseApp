from django.db import models
from django.contrib.auth.models import User
import random
import string
from django.contrib.auth.models import AbstractUser


class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title
    

class EmailVerification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    verification_code = models.CharField(max_length=6, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def generate_code(self):
        self.verification_code = ''.join(random.choices(string.digits, k=6))
        self.save()
        
class Owner(models.Model):
    full_name = models.CharField(max_length=50)
    email = models.EmailField()
    
    def __str__(self):
        return self.name
    
    
class Apartment(models.Model):
    room_name = models.CharField(max_length=50)
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE, related_name='apartments')
    
    def __str__(self):
        return self.room_name
    

class ApartmentsEarnings(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='earnings')
    income = models.DecimalField(max_digits=10, decimal_places=2)  # przychód
    nights = models.IntegerField()                                       # Ilość noclegów
    occupancy = models.DecimalField(max_digits=5, decimal_places=2)      # Obłożenie
    revpar = models.DecimalField(max_digits=10, decimal_places=2)        # RevPAR
    for_owner = models.DecimalField(max_digits=10, decimal_places=2)     # Dla właściciela

    def __str__(self):
        return f"{self.apartment.room_number} - {self.income} zł"