from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets
from .serializers import StatisticSerializer, ChatHistorySerializer, UserSerializer
from .models import Statistic, ChatHistory

from django.contrib.auth.models import User
from django.contrib.auth import login
from django.contrib.sessions.models import Session
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
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
        email = request.data.get('email')

        if not (username and email and password):
            return Response({'error': 'Username, email, and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try: 
            user = User.objects.create_user(username=username, email=email, password=password)

            print("YAYYY, user created")
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e: 
            print(e)
            str(e)
            return Response({'error': str(e)})
    else:
        return Response({'error': 'Invalid method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

@api_view(['POST'])  # for now it is just creating a statistic placeholder for a specific user with default values for the other attributes
def create_statistic(request):
    if request.method == 'POST':
        username = request.data.get('username')
        time = request.data.get('timePlayed')
        result = request.data.get('result')

        print("tyler1", username, time, result)

        game_type = request.query_params.get('gameType')

        # Retrieve the user object
        print("joel", username)
        user = User.objects.get(username=username)

        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        user = get_object_or_404(User, username=username)

        def switch(game_type):
                
                statistics = Statistic.objects.filter(username=user)
                #statistics[0/1/2] = chess/mastermind/yahtzee
                if not statistics.exists():
                    return Response({'error': 'Statistics not found for this user'}, status=status.HTTP_404_NOT_FOUND)
                serialized_statistics = []
                for stat in statistics:
                    serialized_stat = {
                        'gameType': stat.gameType,
                        'gamesPlayed': stat.gamesPlayed,
                        'gamesWon': stat.gamesWon,
                        'timePlayed': stat.timePlayed,
                        'chatHistory': stat.chatHistory,
                    }
                    serialized_statistics.append(serialized_stat)
                

                if game_type == "chess":
                    print("chess")
                    for s in statistics:
                        if s.gameType == "chess":
                            if result:
                                gw = 1 + s.gamesWon
                            else:
                                gw = s.gamesWon
                            
                            chessStatistic = Statistic.objects.create(
                                username=user,
                                ### these are placeholders for now
                                gameType='chess',
                                gamesPlayed=1 + s.gamesPlayed,
                                gamesWon=gw,
                                timePlayed=time + s.timePlayed,
                                chatHistory=None,
                                ###
                                # etc
                            )
                            s.delete()
                elif game_type == "mastermind":
                    print("mastermind")
                    for s in statistics:
                        if s.gameType == "mastermind":
                            if result:
                                gw = 1 + s.gamesWon
                            else:
                                gw = s.gamesWon
                            
                            mastermindStatistic = Statistic.objects.create(
                                username=user,
                                ### these are placeholders for now
                                gameType='mastermind',
                                gamesPlayed=1 + s.gamesPlayed,
                                gamesWon=gw,
                                timePlayed=time + s.timePlayed,
                                chatHistory=None,
                                ###
                                # etc
                            )
                            s.delete()
                elif game_type == "yahtzee":
                    print("yahtzee")
                else:
                    return Response({'error': 'Invalid game query parameter'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
                

        # create Statistic associated with the user
        if game_type:
            switch(game_type)
            return Response({'message': 'Statistic created successfully'}, status=status.HTTP_201_CREATED)

        else:
            chessStatistic = Statistic.objects.create(
                username=user,
                ### these are placeholders for now
                gameType='chess',
                gamesPlayed=0,
                gamesWon=0,
                timePlayed=0.0,
                chatHistory=None,
                ###
                # etc
            )
            mastermindStatistic = Statistic.objects.create(
                username=user,
                ### these are placeholders for now
                gameType='mastermind',
                gamesPlayed=0,
                gamesWon=0,
                timePlayed=0.0,
                chatHistory=None,
                ###
                # etc
            )
            yahtzeeStatistic = Statistic.objects.create(
                username=user,
                ### these are placeholders for now
                gameType='yahtzee',
                gamesPlayed=0,
                gamesWon=0,
                timePlayed=0.0,
                chatHistory=None,
                ###
                # etc
            )
            print("SICK, stats created")
            return Response({'message': 'Statistic created successfully'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Invalid method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
def get_user_info(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_user_statistics(request):
    username = request.query_params.get('username')
    print(username)
    if not username:
        return Response({'error': 'Username not provided in query parameters'}, status=status.HTTP_400_BAD_REQUEST)

    user = get_object_or_404(User, username=username)
    statistics = Statistic.objects.filter(username=user)
    if not statistics.exists():
        return Response({'error': 'Statistics not found for this user'}, status=status.HTTP_404_NOT_FOUND)
    serialized_statistics = []
    for stat in statistics:
        serialized_stat = {
            'gameType': stat.gameType,
            'gamesPlayed': stat.gamesPlayed,
            'gamesWon': stat.gamesWon,
            'timePlayed': stat.timePlayed,
            'chatHistory': stat.chatHistory,
        }
        serialized_statistics.append(serialized_stat)

    print(serialized_statistics)
    return Response({'statistics': serialized_statistics}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user_session(request, format=None):
    #doesn't persist from previous request
    content = {
        'user': str(request.user),  # `django.contrib.auth.User` instance.
    }
    user = request.session.get('curr_user')

    #user = curr_user
    print("hi")
    print(user)
    print(content)
    return Response(content)

@api_view(['POST'])
def authenticate_user(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        print("authenticating")
        if not (username and password):
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(username=username)
            if not user.check_password(password): 
                return Response({'error': 'Incorrect password'})
            request.session['curr_user'] = user.username
            request.session.modified = True
            login(request, user)
            print(request.user)
            curr_user = user.username
            print("user logged in")

            return Response({'message': 'User successfully authenticated'}, status=status.HTTP_201_CREATED)
        except:
            return Response({'error': 'Invalid username'})

    else:
        return Response({'error': 'Invalid method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@api_view(['POST'])
def change_pwd(request):
    if request.method == 'POST': 
        print("hi")
        username = request.data.get('username')
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        print(username, email, new_password)
        if not (username and email and new_password):
            return Response({'error': 'Username, email, and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(username=username)
        if user is None:
            return Response({'error': 'Invalid username'})
        if user.email != email:
            return Response({'error': 'Invalid email'})
        
        user.set_password(new_password)
        user.save()

        print("password changed")
        #then log them in as well? 
        return Response({'message': 'password changed successfully'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Invalid method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    