from django.shortcuts import render
from rest_framework import viewsets
from .serializers import StatisticSerializer, ChatHistorySerializer, UserSerializer
from .models import Statistic, ChatHistory

from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

#class UserView(viewsets.ModelViewSet):
#    serializer_class = UserSerializer
#    queryset = User.objects.all()

class StatisticView(viewsets.ModelViewSet):
    serializer_class = StatisticSerializer
    queryset = Statistic.objects.all()

class ChatHistoryView(viewsets.ModelViewSet):
    serializer_class = ChatHistorySerializer
    queryset = ChatHistory.objects.all()

@api_view(['POST'])  # creates new user using builtin Django User model
def signup(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        if not (username and password):
            return Response({'error': 'Username and Password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)

        print("YAYYY, user created")
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Invalid method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

@api_view(['POST'])  # for now it is just creating a statistic placeholder for a specific user with default values for the other attributes
def create_statistic(request):
    if request.method == 'POST':
        username = request.data.get('username')
        # game_type = request.data.get('game_type')
        # Retrieve the user object
        user = User.objects.get(username=username)

        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # create Statistic associated with the user
        statistic = Statistic.objects.create(
            username=user,
            ### these are placeholders for now
            gameType='hehe xd',
            gamesPlayed=0,
            gamesWon=0,
            timePlayed=0.0,
            chatHistory=None,
            ###
            # etc
        )
        print("SICK, stat created")
        return Response({'message': 'Statistic created successfully'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Invalid method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
def get_user_info(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)