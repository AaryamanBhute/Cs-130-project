"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from gameguru import views

router = routers.DefaultRouter()
#router.register('users', views.UserView, 'gameguru')
router.register('statistics', views.StatisticView)
router.register('chatHistory', views.ChatHistoryView)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('signup/', views.signup, name='signup'),  # these are just POST methods for creating user and statistic from signup button
    path('create-statistic/', views.create_statistic, name='create-statistic'),
    path('authenticate-user/', views.authenticate_user, name='authenticate-user'),
    path('change-pwd/', views.change_pwd, name='change-pwd'),
    path('get-user-statistics/', views.get_user_statistics, name='get-user-statistics'),
]
