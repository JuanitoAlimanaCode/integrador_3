from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import HttpResponse
from django.urls import reverse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from .models import *
from .serializers import *
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status

# Create your views here.

class login_view(LoginView):
    template_name = 'cuenta/login.html'
    next_page = 'inicio'

def logouts(request):
    logout(request)
    return redirect('login')

class listaUsuariosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = perfilUsuario.objects.all()
        serializer = perfilUsuarioSerializer(users, many=True)
        
        print('serializer.data', serializer.data)

        return Response(serializer.data, status=status.HTTP_200_OK) 
    
class RegistroView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("Datos recibidos:", request.data)
        serializer = UserSerializer(data=request.data)  # Usar request.data directamente

        if serializer.is_valid():
            try:
                user = serializer.save()
                return Response(
                    {"message": "Usuario creado exitosamente", "user": UserSerializer(user).data},
                    status=status.HTTP_201_CREATED
                )
            except IntegrityError:
                return Response({"username": ["Este nombre de usuario ya existe."]}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['PUT', 'GET'])
@permission_classes([IsAuthenticated])
def editar_perfil(request):
    try:
        perfil = perfilUsuario.objects.get(user=request.user)  # Obtener el perfil existente

        if request.method == 'GET':
            # Devolver los datos del perfil
            return Response(
                {
                    "username": perfil.user.username,
                    "email": perfil.email,
                    "first_name": perfil.first_name,
                    "last_name": perfil.last_name,
                    "telefono": perfil.telefono,
                    "avatar": perfil.avatar.url if perfil.avatar else None,
                    "descripcion": perfil.descripcion,
                },
                status=status.HTTP_200_OK
            )

        if request.method == 'PUT':
            data = request.data
            perfil.email = data.get('email', perfil.email)
            perfil.first_name = data.get('first_name', perfil.first_name)
            perfil.last_name = data.get('last_name', perfil.last_name)
            perfil.descripcion = data.get('descripcion', perfil.descripcion)
            perfil.telefono = data.get('telefono', perfil.telefono)

            # Verificar si el avatar está en los archivos y actualizar
            if 'avatar' in request.FILES:
                perfil.avatar = request.FILES['avatar']
            
            perfil.save()

            # Devolver los datos del perfil actualizado
            return Response(
                {
                    "username": perfil.user.username,
                    "email": perfil.email,
                    "first_name": perfil.first_name,
                    "last_name": perfil.last_name,
                    "telefono": perfil.telefono,
                    "avatar": perfil.avatar.url if perfil.avatar else None,
                    "descripcion": perfil.descripcion,
                },
                status=status.HTTP_200_OK
            )

    except perfilUsuario.DoesNotExist:
        return Response({"error": "Perfil no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("Error:", e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
