backend-specific setup instructions

run the following commands: 

pip install pipenv
pipenv shell
pipenv install django
pipenv install django-cors-headers djangorestframework
cd backend
python manage.py runserver

    on server (https://localhost:8000)
    https://localhost:8000/admin ->
    admin login-> username: gameguru, email: mgduran@ucla.edu, password: djangogame

    https://localhost:8000/users -> view and add new users