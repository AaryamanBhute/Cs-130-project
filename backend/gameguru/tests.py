from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Statistic

class ViewsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='test_user', email='test@example.com', password='test_password')

    def test_create_statistic(self):
        url = '/create-statistic/'
        data = {'username': 'test_user', 'gameType': 'chess', 'timePlayed': 10, 'result': True}  # Adjust data as needed
        
        # Authenticate the user or use any necessary authentication logic
        self.client.force_authenticate(user=self.user)

        # Send a POST request to create a statistic
        response = self.client.post(url, data, format='json')

        # Check if the request was successful (status code 201 CREATED)
        self.assertEqual(response.status_code, 201)

        # Retrieve the created statistic and validate its attributes
        statistic = Statistic.objects.get(username=self.user, gameType='chess')
        self.assertEqual(statistic.gamesPlayed, 0)  # Adjust assertions based on your logic

    def test_signup(self):
        url = '/signup/'
        data = {'username': 'new_user', 'email': 'new_user@example.com', 'password': 'new_password'}  # Adjust data as needed
        
        response = self.client.post(url, data, format='json')

        # Check if the user was created successfully (status code 201 CREATED)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.filter(username='new_user').count(), 1)  # Check if the user exists in the database

    def test_get_user_statistics(self):
        url = '/get-user-statistics/'
        username = 'test_user'

        # Authenticate the user or use any necessary authentication logic
        self.client.force_authenticate(user=self.user)

        response = self.client.get(url, {'username': username}, format='json')

        # Check if the statistics not retrieved since there is no user
        self.assertEqual(response.status_code, 404)

    def test_authenticate_user(self):
        url = '/authenticate-user/'
        data = {'username': 'test_user', 'password': 'test_password'}

        response = self.client.post(url, data, format='json')

        # Check if the user was authenticated successfully (status code 201 CREATED)
        self.assertEqual(response.status_code, 201)
        self.assertTrue('message' in response.data)  # Check if authentication message is present in the response

    def test_change_pwd(self):
        url = '/change-pwd/'
        data = {'username': 'test_user', 'email': 'test@example.com', 'new_password': 'new_test_password'}

        response = self.client.post(url, data, format='json')

        # Check if the password was changed successfully (status code 201 CREATED)
        self.assertEqual(response.status_code, 201)