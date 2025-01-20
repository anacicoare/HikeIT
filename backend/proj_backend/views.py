import random
from datetime import datetime, timedelta

from django.db.models import Q
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from proj_backend.serializers import LoanSerializer, MyTokenObtainPairSerializer, UserSerializer, CardSerializer

from proj_backend.models import Card, Transfer, UserData, Loan, Review, Favorite


class LeaveReviewView(APIView):
    def post(self, request):
        trail_name = request.data.get("trailName")
        review_text = request.data.get("reviewText")
        user_email = request.data.get("userEmail")

        review = Review(trail_name=trail_name, text=review_text, user=user_email)
        review.save()

        user = UserData.objects.get(email=user_email)
        user.reviews.add(review)
        user.save()

        return Response(data={"Review saved"}, status=200)
    
class AddToFavoritesView(APIView):
    def post(self, request):
        trail_name = request.data.get("trailName")
        user_email = request.data.get("userEmail")

        # Check if the trail is already in the user's favorites
        favorite_trail = Favorite.objects.filter(trail_name=trail_name, user=user_email).first()

        if favorite_trail:
            # If it exists, remove it (unfavorite)
            favorite_trail.delete()
            return Response(data={"message": "Trail removed from Favorites"}, status=200)
        else:
            # Otherwise, add it to favorites
            favorite_trail = Favorite(trail_name=trail_name, user=user_email)
            favorite_trail.save()

            user = UserData.objects.get(email=user_email)
            user.favorites.add(favorite_trail)
            user.save()

            return Response(data={"message": "Trail added to Favorites"}, status=200)

    
class SeeFavoritesView(APIView):
    def post(self, request):
        response_data = []

        user_email = request.data.get("userEmail")
        print(request.data)

        if not user_email:
            return Response({"error": "User email is required."}, status=400)

        # Fetch all favorites that match the provided userEmail
        favorites = Favorite.objects.filter(user=user_email)

        # Assuming Favorite model has fields that you want to return, e.g., trailName
        response_data = [
            {"trailName": favorite.trail_name}
            for favorite in favorites
        ]

        
        
        return Response(response_data, status=200)

class Test(APIView):
    def get(self, request):
        return Response(data={"test": "test"}, status=200)


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class ProfileView(APIView):
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class TransferView(APIView):
    def post(self, request):
        amount = request.data.get('amount')
        details = request.data.get('details')
        sender = request.data.get('sender')

        receiver = request.data.get('receiver')
        iban = request.data.get('iban')
        iban_sender = request.data.get('iban_sender')

        # print amount, details, sender, receiver, iban, iban_sender
        print(amount, details, sender, receiver, iban, iban_sender)

        # check if sender has enough money
        sender_card = Card.objects.get(iban=iban_sender)
        if sender_card.balance < float(amount):
            return Response(data={"insufficient balance"}, status=403)

        # transfer money
        sender_card.balance -= float(amount)
        sender_card.save()

        # update receiver balance
        receiver_card = Card.objects.get(iban=iban)
        receiver_card.balance += float(amount)
        receiver_card.save()

        # save transfer
        transfer = Transfer(amount=amount, details=details, sender=sender, receiver=receiver, iban=iban, iban_sender=iban_sender)
        transfer.save()

        return Response(data={"transfered successfully"}, status=200)


class AddCard(APIView):
    def post(self, request):
        country_code = 'RO'
        check_digits = ''.join(random.choices('0123456789', k=2))
        bban = ''.join(random.choices('0123456789', k=14))
        iban = country_code + check_digits + bban

        # Perform modulus 97 operation to get the checksum
        iban = iban[4:] + iban[:4]
        iban = ''.join(str(int(c, 36)) if c.isalpha() else c for c in iban)
        checksum = int(iban) % 97

        # Format IBAN with checksum
        checksum_digits = '{:02d}'.format(98 - checksum)
        iban = country_code + checksum_digits + bban

        # Format IBAN with spaces for better readability
        iban = ' '.join(iban[i:i+4] for i in range(0, len(iban), 4))

        name = request.data.get('name')
        # Generate the first digit (Issuer Identification Number, IIN)
        iin = '4'  # For Visa cards, starts with 4
        # Generate the next 15 digits (Account Identifier)
        account_number = ''.join(random.choices('0123456789', k=15))
        # Concatenate the IIN and the account number
        card_number = iin + account_number
        # Add spaces for readability
        formatted_card_number = ' '.join(card_number[i:i + 4] for i in range(0, len(card_number), 4))
        card_number = formatted_card_number


        current_date = datetime.now()
        five_years_later = current_date + timedelta(days=365 * 5)
        expiration_date = five_years_later

        cvv = ''.join(random.choices('0123456789', k=3))

        balance = 0

        is_blocked = False

        type = request.data.get('type')
        card = Card(name=name, card_number=card_number, iban=iban, expiration_date=expiration_date, cvv=cvv, balance=balance, is_blocked=is_blocked, type=type)
        card.save()

        sender_email = request.data.get('email')
        crt_user = UserData.objects.get(email=sender_email)
        crt_user.cards.add(card)
        crt_user.save()

        cards = [CardSerializer(card).data for card in crt_user.cards.all()]

        return Response(data={"cards": cards}, status=200)


class MyCards(APIView):
    def get(self, request):
        # Retrieve email query parameter from request.GET
        email = request.GET.get('email')
        if email:
            try:
                # Retrieve user data based on the provided email
                user = UserData.objects.get(email=email)
                cards = [CardSerializer(card).data for card in user.cards.all()]
                return Response(data={"cards": cards}, status=200)
            except UserData.DoesNotExist:
                return Response(data={"error": "User not found"}, status=404)
        else:
            return Response(data={"error": "Email parameter is missing"}, status=400)
        
class MyProfile(APIView):
    def get(self, request):
        email = request.GET.get('email')
        if email:
            try:
                # Retrieve user data based on the provided email
                user = UserData.objects.get(email=email)
                
                # Prepare the response data
                user_data = {
                    "name": user.name,
                    "email": user.email,
                    "is_admin": user.is_admin
                }
                
                return Response(data=user_data, status=200)
            except UserData.DoesNotExist:
                return Response(data={"error": "User not found"}, status=404)
        else:
            return Response(data={"error": "Email parameter is missing"}, status=400)



class LoanView(APIView):
    def post(self, request):
        amount = request.data.get('amount')
        details = request.data.get('details')
        user = request.data.get('user')
        iban = request.data.get('iban')

        card = Card.objects.get(iban=iban)
        card.balance += float(amount)
        card.save()

        loan = Loan(amount=amount, details=details, user=user, iban=iban)
        loan.save()

        return Response(data={"loaned successfully"}, status=200)

class Reports(APIView):
    def get(self, request):
        email = request.GET.get('email')
        if not email:
            return Response(data={"error": "Email parameter is missing"}, status=400)

        try:
            user = UserData.objects.get(email=email)
            # Filter transfers where the sender or the receiver email matches the provided email
            transfers = Transfer.objects.all().filter(Q(sender=user.name) | Q(receiver=user.name))
            if not transfers.exists():
                return Response(data={"error": "No transfers found"}, status=404)

            # Retrieve the amount, receiver, and date of each transfer
            data = [{"amount": transfer.amount, "sender": transfer.sender, "receiver": transfer.receiver, "date": transfer.date} for transfer in transfers]
            return Response(data=data, status=200)
        except Exception as e:
            return Response(data={"error": str(e)}, status=500)
class AllUsers(APIView):
    def get(self, request):
        users = UserData.objects.all()
        users_data = [UserSerializer(user).data for user in users if user.type == 'normal']
        return Response(data={"users": users_data}, status=200)
    
class UpdateUser(APIView):
    def put(self, request):
        email = request.data.get('email')
        user = UserData.objects.get(email=email)
        user.name = request.data.get('name')
        user.email = request.data.get('email')
        user.address = request.data.get('address')
        user.phone = request.data.get('phone')
        user.save()
        
        users = UserData.objects.all()
        users_data = [UserSerializer(user).data for user in users if user.type == 'normal']
        return Response(data={"users": users_data}, status=200)
    
class GetUserCards(APIView):
    def get(self, request):
        email = request.GET.get('email')
        user = UserData.objects.get(email=email)
        cards = [CardSerializer(card).data for card in user.cards.all()]
        return Response(data={"cards": cards}, status=200)
    
class UpdateIbanBalance(APIView):
    def put(self, request):
        iban = request.data.get('iban')
        balance = request.data.get('balance')
        card = Card.objects.get(iban=iban)
        card.balance = balance
        card.save()
        return Response(data={"balance updated successfully"}, status=200)
    
class UpdateLoan(APIView):
    def put(self, request):
        id = request.data.get('id')
        amount = float(request.data.get('amount'))
        loan = Loan.objects.get(id=id)
        loan.amount = str(max(float(loan.amount) - float(amount), 0))
        
        loan.save()
        
        email = request.GET.get('email')
        name = UserData.objects.get(email=email).name
        loans = Loan.objects.filter(user=name)
        loans_data = [LoanSerializer(loan).data for loan in loans]
        return Response(data={"loans": loans_data}, status=200)
    
class GetAllLoans(APIView):
    def get(self, request):
        email = request.GET.get('email')
        user = UserData.objects.get(email=email)
        loans = Loan.objects.filter(user=user.name, amount__gt=0)
        loans_data = [LoanSerializer(loan).data for loan in loans]
        return Response(data={"loans": loans_data}, status=200)
    
class GetAllReviews(APIView):
    def get(self, request):
        user_email = request.GET.get('email')
        print(user_email)
        
        # Get all reviews for the user
        reviews = Review.objects.filter(user=user_email)
        
        # Get all favorited trails for the user
        favorite_trails = Favorite.objects.filter(user=user_email).values_list('trail_name', flat=True)
        
        # Construct response with favorite status
        reviews_data = [
            {
                "trail_name": review.trail_name,
                "text": review.text,
                "is_favorited": "Da" if review.trail_name in favorite_trails else "Nu"   # Check if the trail is favorited
            }
            for review in reviews
        ]
        
        return Response(data={"reviews": reviews_data}, status=200)

    
class GetAllReviewsForTrail(APIView):
    def get(self, request):
        trail_name = request.GET.get('trail_name')
        reviews = Review.objects.filter(trail_name=trail_name)
        reviews_data = [{"user": review.user, "text": review.text} for review in reviews]
        return Response(data={"reviews": reviews_data}, status=200)