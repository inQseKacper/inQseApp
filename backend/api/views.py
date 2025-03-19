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
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

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
                os.getenv("EMAIL_HOST_USER"),
                [user.email],
                fail_silently=False,
            )

            return Response({"message": "Rejestracja udana! Sprawdź swoją skrzynkę e-mail."}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({"error": f"Wystąpił błąd: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


User = get_user_model()   

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_code(request):
    print(f"Pełne request.data: {request.data}")
    email = request.data.get("email")
    code = request.data.get("code")

    print(f"Otrzymano w żądaniu: email={email}, code={code}")

    try:
        user = User.objects.get(email=email)
        verification = EmailVerification.objects.get(user=user)

        print(f"Kod w bazie: {verification.verification_code}")

        if str(verification.verification_code) == str(code):
            user.is_active = True
            user.save()
            verification.delete()
            return Response({"message": "Konto zostało aktywowane!"}, status=200)
        else:
            print("Kod nie pasuje!")
            return Response({"error": "Niepoprawny kod weryfikacyjny."}, status=400)

    except (User.DoesNotExist, EmailVerification.DoesNotExist):
        print("Nie znaleziono użytkownika lub kodu!")
        return Response({"error": "Nie znaleziono użytkownika lub kodu."}, status=400)