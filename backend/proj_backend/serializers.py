from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from proj_backend.models import UserData, Card, Loan


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['name'] = user.name
        token['email'] = user.email
        token['type'] = user.type
        # ...

        return token

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = UserData
        fields = ["id", "email", "name", "password", "type", "address", "phone"]

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["id", "name", "card_number", "iban", "expiration_date", "cvv", "balance", "is_blocked", "type"]
        
class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = ["id", "amount", "details", "user", "iban", "date"]
