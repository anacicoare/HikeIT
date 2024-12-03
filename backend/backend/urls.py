"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from proj_backend import views
from proj_backend.views import MyTokenObtainPairView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/register/", views.RegisterView.as_view(), name="register"),
    path('api/test/', views.Test.as_view(), name='test'),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('api/transfer/', views.TransferView.as_view(), name='transfer'),
    path('api/add_card/', views.AddCard.as_view(), name='add_card'),
    path('api/my_cards/', views.MyCards.as_view(), name='add_card'),
    path('api/profile/', views.MyProfile.as_view(), name='profile'),
    path('api/loan/', views.LoanView.as_view(), name='loans'),
    path('api/reports/', views.Reports.as_view(), name='reports'),
    path('api/all_users/', views.AllUsers.as_view(), name='all_users'),
    path('api/update_user/', views.UpdateUser.as_view(), name='update_user'),
    path('api/get_user_cards/', views.GetUserCards.as_view(), name='get_user_cards'),
    path('api/update_iban_balance/', views.UpdateIbanBalance.as_view(), name='update_iban_balance'),
    path('api/update_loan/', views.UpdateLoan.as_view(), name='update_loan'),
    path('api/get_all_loans/', views.GetAllLoans.as_view(), name='get_all_loans'),
]

