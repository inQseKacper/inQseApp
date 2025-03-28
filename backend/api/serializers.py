from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Owner, Apartment, ApartmentsEarnings


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
        
class AprtmentsEarningsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentsEarnings
        fieds = '__all__'


class ApartmentSerializer(serializers.ModelSerializer):
    earnings = AprtmentsEarningsSerializer(many = True, read_only=True)
    
    class Meta:
        model = Apartment
        fields = ['id', 'room_name', 'owner', 'earnings']
        
class OwnerSerializer(serializers.ModelSerializer):
    apartments = ApartmentSerializer(many=True, read_only=True)
    class Meta:
        model = Owner
        fields = ['id', 'full_name', 'email', 'apartments']


