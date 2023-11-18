from django.contrib import admin
from .models import Statistic, ChatHistory
# Register your models here.

#class UserAdmin(admin.ModelAdmin):
#    list_display=('username', 'firstName', 'lastName')

class StatisticAdmin(admin.ModelAdmin):
    list_display=('username', 'gameType', 'gamesPlayed','gamesWon', 'timePlayed', 'chatHistory')

class ChatHistoryAdmin(admin.ModelAdmin):
    list_display=('username', 'gameType', 'question', 'response')

#admin.site.register(User, UserAdmin)
admin.site.register(Statistic, StatisticAdmin)
admin.site.register(ChatHistory, ChatHistoryAdmin)