from rest_framework import serializers
from .models import Statistic, ChatHistory

#class UserSerializer(serializers.ModelSerializer):
#    class Meta: 
#        model = User
#        fields = ('id', 'username', 'firstName', 'lastName')

class StatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statistic
        fields = ('id', 'username', 'gameType', 'gamesPlayed', 'gamesWon','timePlayed', 'chatHistory')

class ChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatHistory
        fields = ('id', 'username', 'gameType', 'gamesPlayed', 'gamesWon','timePlayed', 'chatHistory')