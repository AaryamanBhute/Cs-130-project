from django.shortcuts import render
from rest_framework import viewsets
from .serializers import StatisticSerializer, ChatHistorySerializer
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

@api_view(['POST'])  # not sure how to use the builtin Django User model
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
    