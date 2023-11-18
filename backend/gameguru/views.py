from django.shortcuts import render
from rest_framework import viewsets
from .serializers import StatisticSerializer, ChatHistorySerializer
from .models import Statistic, ChatHistory

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