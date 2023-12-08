from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Statistic

class ViewsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='test_user', email='test@example.com', password='test_password')

    def test_chess_statistic(self):
        #create statistics
        url = '/create-statistic/'
        data = {'username': 'test_user'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(len(Statistic.objects.filter(username=self.user)),3)

        url = '/create-statistic/?gameType=chess'
        data = {'username': 'test_user', 'timePlayed': 10, 'result': True}

        # Send a POST request to create a statistic
        response = self.client.post(url, data, format='json')

        # Check if the request was successful (status code 201 CREATED)
        self.assertEqual(response.status_code, 201)

        # Validate win statistic
        statistic = Statistic.objects.get(username=self.user, gameType='chess')
        self.assertEqual(statistic.gamesPlayed, 1)
        self.assertEqual(statistic.gamesWon, 1)
        self.assertEqual(statistic.timePlayed, 10)

        data = {'username': 'test_user', 'timePlayed': 20, 'result':False}

        response = self.client.post(url, data, format='json')
        
        # Validate loss statistic
        statistic = Statistic.objects.get(username=self.user, gameType='chess')
        self.assertEqual(statistic.gamesPlayed, 2)
        self.assertEqual(statistic.gamesWon, 1)
        self.assertEqual(statistic.timePlayed, 30)

    def test_mastermind_statistic(self):
        #create statistics
        url = '/create-statistic/'
        data = {'username': 'test_user'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(len(Statistic.objects.filter(username=self.user)),3)

        url = '/create-statistic/?gameType=mastermind'
        data = {'username': 'test_user', 'timePlayed': 10, 'result': True}

        # Send a POST request to create a statistic
        response = self.client.post(url, data, format='json')

        # Check if the request was successful (status code 201 CREATED)
        self.assertEqual(response.status_code, 201)

        # Validate win statistic
        statistic = Statistic.objects.get(username=self.user, gameType='mastermind')
        self.assertEqual(statistic.gamesPlayed, 1)
        self.assertEqual(statistic.gamesWon, 1)
        self.assertEqual(statistic.timePlayed, 10)

        data = {'username': 'test_user', 'timePlayed': 20, 'result':False}

        response = self.client.post(url, data, format='json')
        
        # Validate loss statistic
        statistic = Statistic.objects.get(username=self.user, gameType='mastermind')
        self.assertEqual(statistic.gamesPlayed, 2)
        self.assertEqual(statistic.gamesWon, 1)
        self.assertEqual(statistic.timePlayed, 30)

    def test_yahtzee_statistic(self):
        #create statistics
        url = '/create-statistic/'
        data = {'username': 'test_user'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(len(Statistic.objects.filter(username=self.user)),3)

        url = '/create-statistic/?gameType=yahtzee'
        data = {'username': 'test_user', 'timePlayed': 10, 'result': 45}

        # Send a POST request to create a statistic
        response = self.client.post(url, data, format='json')

        # Check if the request was successful (status code 201 CREATED)
        self.assertEqual(response.status_code, 201)

        # Validate new high score statistic (when no score)
        statistic = Statistic.objects.get(username=self.user, gameType='yahtzee')
        self.assertEqual(statistic.gamesPlayed, 1)
        self.assertEqual(statistic.gamesWon, 45) #=high score
        self.assertEqual(statistic.timePlayed, 10)

        data = {'username': 'test_user', 'timePlayed': 20, 'result':20}

        response = self.client.post(url, data, format='json')
        
        # Validate no new high score statistic
        statistic = Statistic.objects.get(username=self.user, gameType='yahtzee')
        self.assertEqual(statistic.gamesPlayed, 2)
        self.assertEqual(statistic.gamesWon, 45)
        self.assertEqual(statistic.timePlayed, 30)

        # Validate new high score (when high score exists already)
        data = {'username': 'test_user', 'timePlayed': 25, 'result':65}

        response = self.client.post(url, data, format='json')
        
        # Validate no new high score statistic
        statistic = Statistic.objects.get(username=self.user, gameType='yahtzee')
        self.assertEqual(statistic.gamesPlayed, 3)
        self.assertEqual(statistic.gamesWon, 65)
        self.assertEqual(statistic.timePlayed, 55)

        
    def test_new_statistic(self):
        url = '/signup/'
        data = {'username': 'new_user2', 'email': 'new_user2@example.com', 'password': 'new_password2'}
        
        response = self.client.post(url, data, format='json')
    
        url = '/create-statistic/'
        data = {'username': 'new_user2'}
        # Send a POST request to create a statistic
        response = self.client.post(url, data, format='json')
        new_user = User.objects.get(username='new_user2')

        # Check if the request was successful (status code 201 CREATED)
        self.assertEqual(response.status_code, 201)

        # Validate each statistic
        statistic = Statistic.objects.get(username=new_user, gameType='chess')
        self.assertEqual(statistic.gamesPlayed, 0)
        self.assertEqual(statistic.gamesWon, 0)
        self.assertEqual(statistic.timePlayed, 0)

        statistic = Statistic.objects.get(username=new_user, gameType='mastermind')
        self.assertEqual(statistic.gamesPlayed, 0)
        self.assertEqual(statistic.gamesWon, 0)
        self.assertEqual(statistic.timePlayed, 0)

        statistic = Statistic.objects.get(username=new_user, gameType='yahtzee')
        self.assertEqual(statistic.gamesPlayed, 0)
        self.assertEqual(statistic.gamesWon, 0)
        self.assertEqual(statistic.timePlayed, 0)

        self.assertEqual(len(Statistic.objects.filter(username=new_user)), 3)

    def test_signup(self):
        url = '/signup/'
        data = {'username': 'new_user', 'email': 'new_user@example.com', 'password': 'new_password'}
        
        response = self.client.post(url, data, format='json')

        # Check if the user was created successfully (status code 201 CREATED)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.filter(username='new_user').count(), 1)  # Check if the user exists in the database
    
    def test_bad_signup(self):
        url = '/signup/'
        #no username
        data = {'email': 'new_user@example.com', 'password': 'new_password'}
        
        response = self.client.post(url, data, format='json')

        # Check if the user failed to be created (status code 400)
        self.assertEqual(response.status_code, 400)

    def test_bad_get_statistics(self):
        url = '/get-user-statistics/'
        username = 'test_user'

        response = self.client.get(url, {'username': username}, format='json')

        # Check if the statistics not retrieved since there is no user
        self.assertEqual(response.status_code, 404)

    def test_get_user_statistics(self):
        #create statistics
        url = '/create-statistic/'
        data = {'username': 'test_user'}
        response = self.client.post(url, data, format='json')

        url = '/get-user-statistics/'
        username = 'test_user'

        response = self.client.get(url, {'username': username}, format='json')

        # Check if statistics retrieved
        self.assertEqual(response.status_code, 200)
        print(response.data)

    def test_authenticate_user(self):
        url = '/authenticate-user/'
        data = {'username': 'test_user', 'password': 'test_password'}

        response = self.client.post(url, data, format='json')

        # Check if the user was authenticated successfully (status code 201 CREATED)
        self.assertEqual(response.status_code, 201)
        self.assertTrue('message' in response.data)  # Check if authentication message is present in the response

    def test_bad_authenticate(self):
        url = '/authenticate-user/'
        data = {'username': 'test_user', 'password': 'wrong'} #wrong pwd

        response = self.client.post(url, data, format='json')

        # Check if the user failed to be authenticated (error returned)
        self.assertTrue('error' in response.data)

    def test_change_pwd(self):
        url = '/change-pwd/'
        data = {'username': 'test_user', 'email': 'test@example.com', 'new_password': 'new_test_password'}

        response = self.client.post(url, data, format='json')

        # Check if the password was changed successfully (status code 201 CREATED)
        self.assertEqual(response.status_code, 201)
    
    def test_bad_change(self):
        url = '/change-pwd/'
        #wrong email
        data = {'username': 'test_user', 'email': 'test2@example.com', 'new_password': 'new_test_password'}

        response = self.client.post(url, data, format='json')

        # Check if the password change failed
        self.assertTrue('error' in response.data)
