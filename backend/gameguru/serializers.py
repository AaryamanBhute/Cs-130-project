from rest_framework import serializers
from .models import Statistic, ChatHistory
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
   class Meta: 
       model = User
       fields = ('id', 'username', 'password')

class StatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statistic
        fields = ('id', 'username', 'gameType', 'gamesPlayed', 'gamesWon','timePlayed', 'chatHistory')

class ChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatHistory
        fields = ('id', 'username', 'gameType', 'gamesPlayed', 'gamesWon','timePlayed', 'chatHistory')