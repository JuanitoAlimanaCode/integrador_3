from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import CreateView, UpdateView, DeleteView, ListView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from django.urls import reverse_lazy
from django.http import JsonResponse
from django.shortcuts import get_list_or_404
from django.apps import apps
from django.views import View
from django.db.models import Q
from .models import *
from .forms import *

@login_required
# Vista para busquedas
def buscar_datos(request, modelo):
    try:
        ModelClass = apps.get_model("trazabilidad_cl", modelo)  # Cambia "tu_app" por el nombre de tu app
    except LookupError:
        return JsonResponse({"error": f"El modelo '{modelo}' no existe"}, status=400)

    q = request.GET.get("q", "").strip()
    if not q:
        return JsonResponse({"error": "No se proporcionó un término de búsqueda"}, status=400)

    filtros = Q()
    
    # Obtener los campos del modelo
    for field in ModelClass._meta.get_fields():
        if field.is_relation and hasattr(field, "related_model"):  # Si es una ForeignKey
            related_fields = [f.name for f in field.related_model._meta.fields if isinstance(f, (models.CharField, models.TextField))]
            for related_field in related_fields:
                filtros |= Q(**{f"{field.name}__{related_field}__icontains": q})
        elif isinstance(field, (models.CharField, models.TextField)):  # Campos normales de texto
            filtros |= Q(**{f"{field.name}__icontains": q})

    resultados = ModelClass.objects.filter(filtros).values()
    return JsonResponse(list(resultados), safe=False)

@login_required
#Index
def index(request):
    return render (request, 'index.html')


# CRUD de Centros Logisticos
class list_centrologistico(LoginRequiredMixin, ListView):

    model = CentroLogistico
    template_name = 'parametros/centros.html'
    login_url = '/login/'
    context_object_name = 'centroslog'
    paginate_by = 5

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = "Centros Logísticos"  # Aquí defines el título de la página
        return context

class crear_centro(LoginRequiredMixin, CreateView):
    
    model = CentroLogistico
    form_class = centrosForm
    template_name = 'parametros/crear_centro.html'
    login_url = '/login/'
    success_url = reverse_lazy('Centros Logísticos')


class editar_centro(LoginRequiredMixin, UpdateView):

    model = CentroLogistico
    form_class = centrosForm
    template_name = 'parametros/editar_centro.html'
    login_url = '/login/'
    success_url = reverse_lazy('Centros Logísticos')

class delete_centro(LoginRequiredMixin, DeleteView):

    model = CentroLogistico
    template_name = 'parametros/eliminar_centro.html'
    login_url = '/login/'
    success_url = reverse_lazy('Centros Logísticos')


# CRUD de Grupo Clientes
class list_grupoclientes(LoginRequiredMixin, ListView):

    model = GrupoClientes
    template_name = 'parametros/grclientes.html'
    login_url = '/login/'
    context_object_name = 'grclientes'
    paginate_by = 5

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = "Grupos de Clientes"  # Aquí defines el título de la página
        return context

class crear_grclientes(LoginRequiredMixin, CreateView):
    
    model = GrupoClientes
    form_class = grclientesForm
    template_name = 'parametros/crear_grclientes.html'
    login_url = '/login/'
    success_url = reverse_lazy('Grupo Clientes')

class editar_grclientes(LoginRequiredMixin, UpdateView):

    model = GrupoClientes
    form_class = grclientesForm
    template_name = 'parametros/editar_grclientes.html'
    login_url = '/login/'
    success_url = reverse_lazy('Grupo Clientes')

class delete_grclientes(LoginRequiredMixin, DeleteView):

    model = GrupoClientes
    template_name = 'parametros/eliminar_grclientes.html'
    login_url = '/login/'
    success_url = reverse_lazy('Grupo Clientes')

# CRUD de Clientes
class list_clientes(LoginRequiredMixin, ListView):

    model = Clientes
    template_name = 'parametros/clientes.html'
    login_url = '/login/'
    context_object_name = 'clientes'
    paginate_by = 5

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = "Clientes"  
        return context

class crear_clientes(LoginRequiredMixin, CreateView):
    
    model = Clientes
    form_class = clientesForm
    template_name = 'parametros/crear_clientes.html'
    login_url = '/login/'
    success_url = reverse_lazy('Clientes')

class editar_clientes(LoginRequiredMixin, UpdateView):

    model = Clientes
    form_class = clientesForm
    template_name = 'parametros/editar_clientes.html'
    login_url = '/login/'
    success_url = reverse_lazy('Clientes')

class delete_clientes(LoginRequiredMixin, DeleteView):

    model = Clientes
    template_name = 'parametros/eliminar_clientes.html'
    login_url = '/login/'
    success_url = reverse_lazy('Clientes')


















#----------------------- DRF--------------------------

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import *
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import *

### Vista Centros Logísticos ###
class centroLogisticoApiView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        centros_log = CentroLogistico.objects.all()
        serializer = centroLogisticoSerializer(centros_log, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        serializer = centroLogisticoSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class centroLogisticoUpdate(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, pk):
        centros_log = get_object_or_404(CentroLogistico, pk=pk)
        if centros_log is not None:
            serializer = centroLogisticoSerializer(centros_log, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Centro logístico no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        centros_log = get_object_or_404(CentroLogistico, pk=pk)
        if centros_log is not None:
            centros_log.delete()
            return Response({'message': 'Centro Logístico eliminado'}, status=status.HTTP_200_OK)
        return Response({'message': 'Centro logístico no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

### Vista Grupo Clientes ###
class GrupoClientesApiView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        grupocliente = GrupoClientes.objects.all()
        serializer = GrupoClientesSerializer(grupocliente, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = GrupoClientesSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GrupoClientesUpdate(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        grupocliente = get_object_or_404(GrupoClientes, pk=pk)
        if grupocliente is not None:
            serializer = GrupoClientesSerializer(grupocliente, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Grupo de Clientes no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        grupocliente = get_object_or_404(GrupoClientes, pk=pk)
        if grupocliente is not None:
            grupocliente.delete()
            return Response({'message': 'Grupo de Clientes eliminado'}, status=status.HTTP_200_OK)
        return Response({'message': 'Grupo de Clientes no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    
### Vista Clientes ###
class ClientesApiView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        grupo = Clientes.objects.all()
        serializer = ClientesSerializer(grupo, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        print(request.data)
        

        nitcliente= request.data['nitcliente']
        grupocliente = request.data['grupocliente']
        cliente = request.data['cliente']
 
        nuevo_cliente = Clientes.objects.create(
            nitcliente=nitcliente,
            grupocliente_id=int(grupocliente),
            cliente=cliente,
        )

        serializer = ClientesSerializer(nuevo_cliente)

        return Response(serializer.data, status= status.HTTP_201_CREATED)
        
        

        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # print(serializer.errors)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClientesUpdate(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        grupo = get_object_or_404(Clientes, pk=pk)
        if grupo is not None:
            print(f"Datos recibidos para el cliente {pk}: {request.data}")

            try:
                grupo_cliente_obj = GrupoClientes.objects.get(pk=request.data['grupocliente'])
                grupo.grupocliente = grupo_cliente_obj
                data = request.data.copy()
                #data['grupocliente'] = grupo_cliente_obj.id
            except GrupoClientes.DoesNotExist:
                return Response({'message': 'Grupo no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

            serializer = ClientesSerializer(grupo, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Cliente no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        grupo = get_object_or_404(Clientes, pk=pk)
        if grupo is not None:
            grupo.delete()
            return Response({'message': 'Cliente eliminado'}, status=status.HTTP_200_OK)
        return Response({'message': 'Cliente no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

### Vista Tipos de Servicio ###
class TipoServicioApiView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        grupo = TipoServicio.objects.all()
        serializer = TipoServicioSerializer(grupo, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TipoServicioSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TipoServicioUpdate(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        grupo = get_object_or_404(TipoServicio, pk=pk)
        if grupo is not None:
            serializer = TipoServicioSerializer(grupo, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Tipo de Servicio no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        grupo = get_object_or_404(TipoServicio, pk=pk)
        if grupo is not None:
            grupo.delete()
            return Response({'message': 'Tipo de Servicio eliminado'}, status=status.HTTP_200_OK)
        return Response({'message': 'Tipo de Servicio no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

### Vista Grupos de Servicio ###
class GrupoServicioApiView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        grupo = GrupoServicio.objects.all()
        serializer = GrupoServicioSerializer(grupo, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        print("Datos recibidos:", request.data)
        serializer = GrupoServicioSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GrupoServicioUpdate(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        grupo = get_object_or_404(GrupoServicio, pk=pk)
        if grupo is not None:
            print(f"Datos recibidos para el grupo {pk}: {request.data}")

            try:
                tipo_servicio_obj = TipoServicio.objects.get(pk=request.data['tipo'])
                grupo.tipo = tipo_servicio_obj
                data = request.data.copy()
                #data['tipo'] = tipo_servicio_obj.id
            except TipoServicio.DoesNotExist:
                return Response({'message': 'Tipo de servicio no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

            serializer = GrupoServicioSerializer(grupo, data=data, partial=True) # Pasa la INSTANCIA 'grupo'
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Grupo de Servicio no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        grupo = get_object_or_404(GrupoServicio, pk=pk)
        if grupo is not None:
            grupo.delete()
            return Response({'message': 'Grupo servicio eliminada'}, status=status.HTTP_200_OK)
        return Response({'message': 'Grupo Servicio no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def obtener_grupos_por_tipo(request, tipo_id):

    grupos = GrupoServicio.objects.filter(tipo_id=tipo_id)  
    serializer = GrupoServicioSerializer(grupos, many=True) 
    return Response(serializer.data)  

@api_view(['GET'])
def obtener_servicios_por_grupo(request, tipo_id, grupo_id):

    servicio = Servicios.objects.filter(tipo_id=tipo_id, grupo_id=grupo_id)
    serializer = ServiciosSerializer(servicio, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def obtener_ubicacion_por_grupo(request, tipo_id, grupo_id):

    ubicacion = Ubicacion.objects.filter(tipo_id=tipo_id, grupo_id=grupo_id)
    serializer = UbicacionSerializer(ubicacion, many=True)
    return Response(serializer.data)

### Vista Ubicacion ###
class UbicacionApiView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        grupo = Ubicacion.objects.all()
        serializer = UbicacionSerializer(grupo, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        
        print("Datos recibidos:", request.data)
        serializer = UbicacionSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UbicacionUpdate(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        ubicacion = get_object_or_404(Ubicacion, pk=pk)
        if ubicacion is not None:
            print(f"Datos recibidos para la ubicación {pk}: {request.data}")
            print(f"Tipo ID recibido: {request.data.get('tipo')}")
            print(f"Grupo ID recibido: {request.data.get('grupo')}")

            try:
                tipo_servicio_obj = TipoServicio.objects.get(pk=request.data['tipo'])
                print(f"Objeto TipoServicio encontrado: {tipo_servicio_obj} (ID: {tipo_servicio_obj.id})")
                ubicacion.tipo = tipo_servicio_obj
            except TipoServicio.DoesNotExist:
                return Response({'message': 'Tipo de servicio no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                grupo_servicio_obj = GrupoServicio.objects.get(pk=request.data['grupo'])
                print(f"Objeto GrupoServicio encontrado: {grupo_servicio_obj} (ID: {grupo_servicio_obj.id})")
                ubicacion.grupo = grupo_servicio_obj
            except GrupoServicio.DoesNotExist:
                return Response({'message': 'Grupo de servicio no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

            data = request.data.copy()
            #data['tipo'] = tipo_servicio_obj.id
            #data['grupo'] = grupo_servicio_obj.id
            print(f"Datos preparados para el serializador: {data}")

            serializer = UbicacionSerializer(ubicacion, data=data, partial=True) # Pasa la INSTANCIA 'ubicacion'
            if serializer.is_valid():
                print(f"Valores de tipo y grupo ANTES de guardar: Tipo ID = {ubicacion.tipo_id}, Grupo ID = {ubicacion.grupo_id}")
                serializer.save()
                print(f"Valores de tipo y grupo DESPUÉS de guardar: Tipo ID = {ubicacion.tipo_id}, Grupo ID = {ubicacion.grupo_id}")
                print("Ubicación guardada:", serializer.data)
                return Response(serializer.data, status=status.HTTP_200_OK)
            print("Errores del serializador:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Ubicación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)


    def delete(self, request, pk):
        grupo = get_object_or_404(Ubicacion, pk=pk)
        if grupo is not None:
            grupo.delete()
            return Response({'message': 'Ubicación eliminada'}, status=status.HTTP_200_OK)
        return Response({'message': 'Ubicación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

### Vista Servicios ###
class ServiciosApiView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        grupo = Servicios.objects.all()
        serializer = ServiciosSerializer(grupo, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ServiciosSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ServiciosUpdate(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        servicio = get_object_or_404(Servicios, pk=pk)
        if servicio is not None:
            
            try:
                tipo_servicio_obj = TipoServicio.objects.get(pk=request.data['tipo'])
                print(f"Objeto TipoServicio encontrado: {tipo_servicio_obj} (ID: {tipo_servicio_obj.id})")
                servicio.tipo = tipo_servicio_obj
            except TipoServicio.DoesNotExist:
                return Response({'message': 'Tipo de servicio no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                grupo_servicio_obj = GrupoServicio.objects.get(pk=request.data['grupo'])
                print(f"Objeto GrupoServicio encontrado: {grupo_servicio_obj} (ID: {grupo_servicio_obj.id})")
                servicio.grupo = grupo_servicio_obj
            except GrupoServicio.DoesNotExist:
                return Response({'message': 'Grupo de servicio no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

            data = request.data.copy()
            print(f"Datos preparados para el serializador: {data}")

            serializer = ServiciosSerializer(servicio, data=data, partial=True) 
            if serializer.is_valid():
                print(f"Valores de tipo y grupo ANTES de guardar: Tipo ID = {servicio.tipo_id}, Grupo ID = {servicio.grupo_id}")
                serializer.save()
                print(f"Valores de tipo y grupo DESPUÉS de guardar: Tipo ID = {servicio.tipo_id}, Grupo ID = {servicio.grupo_id}")
                print("Servicio guardado:", serializer.data)
                return Response(serializer.data, status=status.HTTP_200_OK)
            print("Errores del serializador:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Servicio no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        grupo = get_object_or_404(Servicios, pk=pk)
        if grupo is not None:
            grupo.delete()
            return Response({'message': 'Servicio eliminado'}, status=status.HTTP_200_OK)
        return Response({'message': 'Servicio no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

### Vista Tarifas ###
class TarifasApiView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        grupo = Tarifas.objects.all()
        serializer = TarifasSerializer(grupo, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TarifasSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TarifasUpdate(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        tarifa = get_object_or_404(Tarifas, pk=pk)
        if tarifa is not None:
            
            try:
                cliente_tarifa_obj = Clientes.objects.get(pk=request.data['cliente'])
                tarifa.cliente = cliente_tarifa_obj
            except Clientes.DoesNotExist:
                return Response({'message': 'Cliente no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                tipo_tarifa_obj = TipoServicio.objects.get(pk=request.data['tipo'])
                tarifa.tipo = tipo_tarifa_obj
            except TipoServicio.DoesNotExist:
                return Response({'message': 'Tipo de servicio no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                grupo_tarifa_obj = GrupoServicio.objects.get(pk=request.data['grupo'])
                tarifa.grupo = grupo_tarifa_obj
            except GrupoServicio.DoesNotExist:
                return Response({'message': 'Grupo de servicio no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                servicio_tarifa_obj = Servicios.objects.get(pk=request.data['servicio'])
                tarifa.servicio = servicio_tarifa_obj
            except Servicios.DoesNotExist:
                return Response({'message': 'Servicio no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)
            
            data = request.data.copy()

            serializer = TarifasSerializer(tarifa, data=data, partial=True) 
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            print("Errores del serializador:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Servicio no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        grupo = get_object_or_404(Tarifas, pk=pk)
        if grupo is not None:
            grupo.delete()
            return Response({'message': 'Tarifa eliminada'}, status=status.HTTP_200_OK)
        return Response({'message': 'Tarifa no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

### Vista Agregar Servicios ###
class agregarservicioApiView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        vin = request.GET.get('vin')
        if vin:
            registros = agregarservicio.objects.filter(VIN=vin)
        else:
            registros = agregarservicio.objects.all()

        serializer = agregarservicioListSerializer(registros, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        print(f"Datos recibidos: {request.data}")
        
        # Verificar las relaciones, asegurándonos de que los valores se asignen correctamente
        tipo = TipoServicio.objects.filter(id=request.data['tipo']).first()
        grupo = GrupoServicio.objects.filter(id=request.data['grupo']).first()
        ubicacion = Ubicacion.objects.filter(id=request.data['ubicacion']).first()
        servicio = Servicios.objects.filter(id=request.data['servicio']).first()

        # Verificar que todos los ForeignKey existan
        if not tipo or not grupo or not ubicacion or not servicio:
            print("Alguno de los IDs de las relaciones no es válido.")
            return Response({"error": "Uno o más IDs de relaciones no son válidos."}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener la foto si está presente en la solicitud
        foto = request.data.get('foto', None)  # Si no hay foto, será None

        # Crear el diccionario para pasar los datos al serializer
        data = {
            'VIN': request.data['VIN'],
            'placa': request.data.get('placa', ''),  # Si no hay placa, asignar vacío
            'cliente': request.data['cliente'],
            'ubicacion': request.data['ubicacion'],  # ID de Ubicacion
            'tipo': request.data['tipo'],  # ID de Tipo
            'grupo': request.data['grupo'],  # ID de Grupo
            'servicio': request.data['servicio'],  # ID de Servicio
            'tarifa': request.data['tarifa'],
            'latitud': request.data['latitud'],
            'longitud': request.data['longitud'],
            'centrolog': request.data['centrolog'],
            'usuario': request.data['usuario'],
        }

        # Si la foto está presente, agregarla al diccionario de datos
        if foto:
            data['foto'] = foto  # Aquí agregamos la foto si está presente
        
        # Procesar el serializer con los datos verificados
        serializer = agregarservicioSerializer(data=data)

        # Verificar si el serializer es válido
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Si el serializer no es válido, devolver los errores
        print(f"Errores del serializer: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class agregarservicioUpdate(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        grupo = get_object_or_404(agregarservicio, pk=pk)
        if grupo is not None:
            serializer = agregarservicioSerializer(agregarservicio, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Servicio no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        grupo = get_object_or_404(agregarservicio, pk=pk)
        if grupo is not None:
            grupo.delete()
            return Response({'message': 'Servicio eliminado'}, status=status.HTTP_200_OK)
        return Response({'message': 'Servicio no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    










#Nuevas vistas con viewsets

from rest_framework import viewsets, permissions

class centroLogisticoViewSet(viewsets.ModelViewSet):
    queryset = CentroLogistico.objects.all()
    serializer_class = centroLogisticoSerializer
    permission_classes = [permissions.IsAuthenticated]


