"""
URL configuration for trazabilidad project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from django.urls import path, include
from django.contrib import admin
from django.contrib.auth.views import LogoutView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from trazabilidad_cl.views import *
from cuenta.views import *

router = DefaultRouter()
router.register(r'centros_log-list', centroLogisticoViewSet)


urlpatterns = [
    path('admin/', admin.site.urls, name="admin"),
    path('login/', login_view.as_view(), name='login'),
    path('logout/', logouts, name='logout'),
    path('', index, name='inicio'),
    path("buscar_datos/<str:modelo>/", buscar_datos, name="buscar_datos"),
    path('usuarios/', listaUsuariosView.as_view(), name='usuarios'),
    
#paths centros logisticos
    path('centros_log', list_centrologistico.as_view(), name='Centros Logísticos'),
    path('centros_log/crear/', crear_centro.as_view(), name='CrearCentroLogístico'),
    path('centros_log/editar/<int:pk>', editar_centro.as_view(), name='EditarCentroLogístico'),
    path('centros_log/eliminar/<int:pk>', delete_centro.as_view(), name='EliminarCentroLogístico'),
#paths grupos clientes
    path('grclientes', list_grupoclientes.as_view(), name='Grupo Clientes'),
    path('grclientes/crear/', crear_grclientes.as_view(), name='CrearGrupoClientes'),
    path('grclientes/editar/<int:pk>', editar_grclientes.as_view(), name='EditarGrupoClientes'),
    path('grclientes/eliminar/<int:pk>', delete_grclientes.as_view(), name='EliminarGrupoClientes'),
#paths clientes
    path('clientes', list_clientes.as_view(), name='Clientes'),
    path('clientes/crear/', crear_clientes.as_view(), name='CrearClientes'),
    path('clientes/editar/<int:pk>', editar_clientes.as_view(), name='EditarClientes'),
    path('clientes/eliminar/<int:pk>', delete_clientes.as_view(), name='EliminarClientes'),


#DRF
    path('api/centros_log/',centroLogisticoApiView.as_view(), name='api_centros_log'),
    path('api/grupocliente/',GrupoClientesApiView.as_view(), name='api_grupocliente'),
    path('api/clientes/',ClientesApiView.as_view(), name='api_clientes'),
    path('api/tipo/',TipoServicioApiView.as_view(), name='api_tipo'),
    path('api/grupo/',GrupoServicioApiView.as_view(), name='api_grupo'),
    path('api/ubicacion/',UbicacionApiView.as_view(), name='api_ubicacion'),
    path('api/servicios/',ServiciosApiView.as_view(), name='api_servicios'),
    path('api/tarifas/',TarifasApiView.as_view(), name='api_tarifas'),
    path('api/agregar/',agregarservicioApiView.as_view(), name='api_agregar'),

    path('api/centros_log/<int:pk>/',centroLogisticoUpdate.as_view(), name='api_centros_log_update'),
    path('api/grupocliente/<int:pk>/',GrupoClientesUpdate.as_view(), name='api_grupocliente_update'),
    path('api/clientes/<int:pk>/',ClientesUpdate.as_view(), name='api_clientes_update'),
    path('api/tipo/<int:pk>/',TipoServicioUpdate.as_view(), name='api_tipo_update'),
    path('api/grupo/<int:pk>/',GrupoServicioUpdate.as_view(), name='api_grupo_update'),
    path('api/ubicacion/<int:pk>/',UbicacionUpdate.as_view(), name='api_ubicacion_update'),
    path('api/servicios/<int:pk>/',ServiciosUpdate.as_view(), name='api_servicios_update'),
    path('api/tarifas/<int:pk>/',TarifasUpdate.as_view(), name='api_tarifas_update'),
    path('api/agregar/<int:pk>/',agregarservicioUpdate.as_view(), name='api_agregar_update'),

    path('api/grupos_por_tipo/<int:tipo_id>/', obtener_grupos_por_tipo, name='grupos_por_tipo'),
    path('api/servicios_por_grupo/<int:tipo_id>/<int:grupo_id>/', obtener_servicios_por_grupo, name='servicios_por_grupo'),
    path('api/ubicacion_por_grupo/<int:tipo_id>/<int:grupo_id>/', obtener_ubicacion_por_grupo, name='ubicacion_por_grupo'),

    path('api/token/',TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/agregar/',TokenRefreshView.as_view(), name='token_refresh'),

    path('api/registro/',RegistroView.as_view(), name='registro'),
    path('api/editarperfil/', editar_perfil, name='editarperfil'),
    
#Api a Reacts
    path('api/',include(router.urls)),


]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
