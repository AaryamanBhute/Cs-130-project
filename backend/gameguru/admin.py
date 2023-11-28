from django.contrib import admin
from django.contrib.sessions.models import Session
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

class SessionAdmin(admin.ModelAdmin):
    def _session_data(self, obj):
        return obj.get_decoded()
    list_display = ['session_key', '_session_data', 'expire_date']
admin.site.register(Session, SessionAdmin)