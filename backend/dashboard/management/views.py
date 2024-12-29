from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import ProjectSerializer, UserSerializer, UserRegisterSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
from django.core.mail import EmailMessage, EmailMultiAlternatives
from .models import Project
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
import requests
import json
from django.views.decorators.csrf import csrf_exempt
import re
from django.contrib.auth.decorators import login_required
from allauth.account.views import LoginView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from rest_framework.decorators import api_view, permission_classes
from transformers import pipeline
from google.oauth2 import id_token
import os
from dotenv import load_dotenv
from social_django.utils import load_strategy
from social_core.backends.google import GoogleOAuth2
from django.contrib.auth.models import User
from google.auth.transport.requests import Request
from google.oauth2 import id_token
import requests
from rest_framework_simplejwt.tokens import RefreshToken



GOOGLE_API_URL = 'https://oauth2.googleapis.com/token'
my_client_id = os.getenv('ID_CLIENT')
secret_client_key = os.getenv('SECRET_KEY')
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

class GoogleLoginView(APIView):
    permission_classes= [AllowAny]
    def post(self, request):
        token = request.data.get("credential")
        
        if not token:
            return Response({"error": "Token not provided"}, status=HTTP_400_BAD_REQUEST)
        try:
            # Verify the token
            
            idinfo = id_token.verify_oauth2_token( token, Request(),my_client_id)
            print('idinfo',idinfo)

            

            email = idinfo["email"]
            name = idinfo["name"]

            # Check if user exists, if not create one
            user, created = User.objects.get_or_create(
                username=email,
                defaults={"first_name": name, "email": email},
            )

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            response = JsonResponse({
                "message": "Login successful",
                "status": 200,
                "email": email,
                "access_token": access_token,
                "refresh_token" : refresh_token,
            })

            # Set access token in cookies (expires in 1 hour)
            response.set_cookie(
                'access_token', access_token,
                 # 1 hour
                httponly=True,  # HttpOnly flag to prevent JavaScript access
                secure=True,  # Secure if using HTTPS
                samesite='Strict',  # Optional: Prevent CSRF
            )

            # Set refresh token in cookies (expires in 1 day)
            response.set_cookie(
                'refresh_token', refresh_token,
                  # 1 day
                httponly=True,
                secure=True,
                samesite='Strict',
            )
            response['Location'] = '/project-dashboard'


            return response
        except ValueError as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    print(request.data)
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        print('hello')
        return Response(serializer.data)
    print("Validation Errors:", serializer.errors)  # Print validation errors for debugging
    return Response('registering', status=400)



class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            seriliazer = UserSerializer(request.user, many=False)

            res = Response()

            res.data = {'success':True}

            res.set_cookie(
                key='access_token',
                value=str(access_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            res.set_cookie(
                key='refresh_token',
                value=str(refresh_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            res.data.update(tokens)
            return res
        
        except Exception as e:
            print(e)
            return Response({'success':False})


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            
            tokens = response.data
            access_token = tokens['access']

            res = Response()

            res.data = {'refreshed': True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='None',
                path='/'
            )
            return res

        except Exception as e:
            print(e)
            return Response({'refreshed': False})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        res = Response()
        res.data = {'success':True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')

        return res

    except Exception as e:
        print(e)
        return Response({'success':False})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_logged_in(request):
    serializer = UserSerializer(request.user, many=False)
    return Response(serializer.data)        
# Create your views here.

class CreateProjectView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request, *args, **kwargs):
        print("Authorization Header:", request.headers.get("Authorization"))
        print("User:", request.user)
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user= request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

class ListProjectView(APIView):
    
    def get(self, request, *args, **kwargs):
        projects = Project.objects.filter(user=request.user)
        serializer = ProjectSerializer(projects, many=True)
        return Response({'projects': serializer.data})

class EditProjectView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self,request,id):
        try:
            project= Project.objects.get(id=id)
        except Project.DoesNotExist:
            return Response({'error': 'Project Not Found'},status=status.HTTP_404_NOT_FOUND)
        serializer= ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectView(APIView):
    permission_classes= [IsAuthenticated]
    def get(self, request, id, *args, **kwargs):
        try:
            project = Project.objects.get(id=id)
        except Project.DoesNotExist:
            return Response({'error': 'Project Not Found'}, status=status.HTTP_404_NOT_FOUND)
        serializer= ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DeleteProjectView(APIView):
    def delete(self, request, id, *args, **kwargs):
        try:
            project = Project.objects.get(id=id)
        except Project.DoesNotExist:
            return Response({'error': 'Project Not Found'}, status=status.HTTP_404_NOT_FOUND)
        project.delete()
        return Response({'response': 'Project successfuly deleted'}, status=status.HTTP_204_NO_CONTENT)
@csrf_exempt
def generate_summary(request):
    """API endpoint to generate a summary using Hugging Face."""
    if request.method == "POST":
        import json
        data = json.loads(request.body)
        description = data.get("description", "")

        if not description:
            return JsonResponse({"error": "Description is required"}, status=400)

        try:
            # Use the summarizer to generate a summary
            summary = summarizer(description, max_length=150, min_length=50, do_sample=False)
            ai_summary = summary[0]["summary_text"]

            return JsonResponse({"summary": ai_summary}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid HTTP method"}, status=405)      


def generate_pdf(request, id):
    project = Project.objects.get(id=id)
    html_content_file= render_to_string('project.html', {'data': project, 'MEDIA_URL': settings.MEDIA_URL}) 
    pdf = HTML(string=html_content_file, base_url=request.build_absolute_uri('/')).write_pdf()
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition']= f'attachement; filename= "{project.title}_project.pdf" '
    
    return response



# Function to format the project content into plain text
def convert_html_to_text(project):
    formatted_text = f"{'='*20}\n"
    formatted_text += f"{project.title.title()} Project\n"
    formatted_text += f"{'='*20}\n\n"

    formatted_text += f"{project.description}\n\n"

    formatted_text += f"*Start date:*  {project.start_date}\n\n"
    formatted_text += f"*End date:*  {project.end_date}\n\n"
    formatted_text += f"*Status:*  {project.status}\n\n"
    formatted_text += f"*Priority:*  {project.priority}\n\n"
    formatted_text += f"*Category:*  {project.category}\n\n"

    return formatted_text

@csrf_exempt
def send_project_as_email(request, id):
    project = get_object_or_404(Project, id=id)
    try:
        data = json.loads(request.body)
        receiver_email = data.get('receiver_email')  
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    if not receiver_email:
        return JsonResponse({'error':'Please enter the reciever email'}, status=400)
    subject = f'Details of {project.title.title()} Project'
    plain_text_message = convert_html_to_text(project)

    Email_object= EmailMultiAlternatives(subject, plain_text_message, settings.EMAIL_HOST_USER, [receiver_email])
    """
    if project.image1:
        Email_object.attach_file(project.image1.path)
    if project.image2:
        Email_object.attach_file(project.image2.path)"""
    try:
        Email_object.send()
        return JsonResponse({'response': 'Project sent successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
