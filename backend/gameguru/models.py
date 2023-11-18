from django.db import models
from django.contrib.auth.models import User
#from django.contrib.postgres.fields import ArrayField

# Create your models here.

#class User(models.Model):
#    username = models.CharField(max_length=120)
#    firstName = models.TextField()
#    lastName = models.TextField()

#    def _str_(self):
#        return self.username
    
class Statistic(models.Model):
    #statistic per game (so like 1 user has 3 statistics)
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    gameType = models.TextField()
    gamesPlayed = models.IntegerField()
    gamesWon = models.IntegerField()
    timePlayed = models.FloatField()
    chatHistory = models.TextField(null=True) #may delete 
    #chatHistory = ArrayField(models.TextField)

    def _str_(self):
        return self.gamesPlayed
    
class ChatHistory(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    gameType = models.TextField()
    question = models.TextField()
    response = models.TextField()

