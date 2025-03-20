from django.contrib.auth.models import User
from rest_framework import generics, status
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from .models import EmailVerification
import random
import string
import os
from django.core.mail import send_mail
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.utils.http import urlsafe_base64_decode


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
        email = serializer.validated_data.get("email")
        if User.objects.filter(email=email).exists():
            raise ValidationError({"email": "Użytkownik z tym adresem e-mail już istnieje."})

        
        try:
            user = serializer.save(is_active=False)

            verification_code = ''.join(random.choices(string.digits, k=6))
            EmailVerification.objects.create(user=user, verification_code=verification_code)

            send_mail(
                "Twój kod weryfikacyjny",
                f"Twój kod weryfikacyjny to: {verification_code}",
                "Tutja możesz potwierdzić swój kod: https://inqsepartner.netlify.app/verify",
                os.getenv("EMAIL_HOST_USER"),
                [user.email],
                fail_silently=False,
            )

            return Response({"message": "Rejestracja udana! Sprawdź swoją skrzynkę e-mail."}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({"error": f"Wystąpił błąd: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


User = get_user_model()   

class VerifyCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("code")

        print(f"Otrzymano w żądaniu: email={email}, code={code}")
        
        try:
            user = User.objects.get(email=email)
            verification = EmailVerification.objects.get(user=user)

            if verification.verification_code == code:
                user.is_active = True
                user.save()
                verification.delete()
                return Response({"message": "Konto zostało aktywowane!"}, status=200)
            else:
                return Response({"error": "Niepoprawny kod weryfikacyjny."}, status=400)
        
        except (User.DoesNotExist, EmailVerification.DoesNotExist):
            return Response({"error": "Nie znaleziono użytkownika lub kodu."}, status=400)
        
class ResendVerificationCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)

            if user.is_active:
                return Response(
                     {"error": "To konto jest już aktywne. Nie można ponownie wysłać kodu."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            verification, created = EmailVerification.objects.get_or_create(user=user)

            # Generujemy nowy kod weryfikacyjny
            new_code = ''.join(random.choices(string.digits, k=6))
            verification.verification_code = new_code
            verification.save()

            # Wysyłamy nowy email
            send_mail(
                "Twój nowy kod weryfikacyjny",
                f"Twój nowy kod to: {new_code}",
                "inqsepartner@gmail.com",
                [email],
                fail_silently=False,
            )

            return Response({"message": "Nowy kod weryfikacyjny został wysłany."}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "Nie znaleziono użytkownika z tym adresem e-mail."}, status=status.HTTP_400_BAD_REQUEST)
        
class RequestResetPasswordView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Nie znaleziono konta z tym adresem e-mail."}, status=status.HTTP_400_BAD_REQUEST)

        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_link = f"https://inqsepartner.netlify.app/password-reset-confirm/{uidb64}/{token}"
        
        send_mail(
            "Resetowanie hasła",
            f"Kliknij poniższy link, aby zresetować hasło: {reset_link}",
            "inqsepartner@gmail.com",
            [user.email],
            fail_silently=False,
        )

        return Response({"message": "E-mail z linkiem do resetowania hasła został wysłany."}, status=status.HTTP_200_OK)



class ResetPasswordConfirmView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)

            # Weryfikacja tokena
            if not default_token_generator.check_token(user, token):
                return Response({"error": "Token jest nieprawidłowy lub wygasł."}, status=status.HTTP_400_BAD_REQUEST)

            # Pobranie nowego hasła
            new_password = request.data.get("new_password")
            confirm_password = request.data.get("confirm_password")

            if new_password != confirm_password:
                return Response({"error": "Hasła nie pasują do siebie."}, status=status.HTTP_400_BAD_REQUEST)

            # Zmiana hasła użytkownika
            user.set_password(new_password)
            user.save()

            return Response({"message": "Hasło zostało zmienione."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Błąd przetwarzania żądania."}, status=status.HTTP_400_BAD_REQUEST)