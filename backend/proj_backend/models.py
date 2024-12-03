from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.core.validators import RegexValidator


# Create your models here.

class Transfer(models.Model):
    amount = models.FloatField()
    details = models.CharField(max_length=255)
    sender = models.CharField(max_length=255)
    receiver = models.CharField(max_length=255)
    iban_sender = models.CharField(max_length=34)
    iban = models.CharField(max_length=34)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender} -> {self.receiver} : {self.amount}'
    

class Card(models.Model):
    name = models.CharField(max_length=255)
    card_number = models.CharField(max_length=255)
    iban = models.CharField(max_length=255, unique=True)
    expiration_date = models.DateField()
    cvv = models.CharField(max_length=3)
    balance = models.FloatField(default=0)
    is_blocked = models.BooleanField(default=False)
    type = models.CharField(max_length=255)

    def __str__(self):
        return self.card_number
    

class Loan(models.Model):
    amount = models.FloatField()
    details = models.CharField(max_length=255)
    user = models.CharField(max_length=255)
    iban = models.CharField(max_length=34)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} : {self.amount}'


class UserManager(BaseUserManager):
    use_in_migration = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is Required')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff = True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser = True')

        return self.create_user(email, password, **extra_fields)

class UserData(AbstractUser):
    username = None
    name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    type = models.CharField(max_length=100, default='normal')
    cards = models.ManyToManyField(Card)
    address = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)

    groups = models.ManyToManyField(
        Group,
        verbose_name='user groups',
        blank=True,
        related_name="userdata_groups",
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_query_name="userdata",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user specific permissions',
        blank=True,
        related_name="userdata_user_permissions",
        help_text='Specific permissions for this user.',
        related_query_name="userdata",
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

