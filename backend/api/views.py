from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from .models import EmailVerification
import random
import string
import os
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.decorators import api_view

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save(is_active=False)

        verification_code = ''.join(random.choices(string.digits, k=6))
        EmailVerification.objects.create(user=user, verification_code=verification_code)

        send_mail(
            "Twój kod weryfikacyjny",
            f"Twój kod weryfikacyjny to: {verification_code}",
            os.getenv("EMAIL_HOST_USER"),
            [user.email],  # Odbiorca
            fail_silently=False,
        )
        return Response({"message": "Rejestracja udana! Sprawdź swoją skrzynkę e-mail."}, status=201)
    

@api_view(['POST'])
def verify_code(requset):
    email = requset.data.get(email)
    code = requset.data.get(code)
    
    try:
        user = User.objects.get(email=email)
        verification = EmailVerification.objects.get(user=user)

        if verification.verification_code == code:
            user.is_active = True  # Aktywujemy konto!
            user.save()
            verification.delete()  # Usuwamy kod po aktywacji
            return Response({"message": "Konto zostało aktywowane!"}, status=200)
        else:
            return Response({"error": "Niepoprawny kod weryfikacyjny."}, status=400)

    except (User.DoesNotExist, EmailVerification.DoesNotExist):
        return Response({"error": "Nie znaleziono użytkownika lub kodu."}, status=400)