from rest_framework import serializers
from .models import *
from cuenta.serializers import perfilUsuarioSerializer

#Api Centros Logisticos
class centroLogisticoSerializer(serializers.ModelSerializer):

    class Meta:
        model = CentroLogistico
        fields = '__all__'

#Api Grupos Clientes
class GrupoClientesSerializer(serializers.ModelSerializer):

    class Meta:
        model = GrupoClientes
        fields = '__all__'

#Api Clientes
class ClientesSerializer(serializers.ModelSerializer):
    grupocliente = serializers.SerializerMethodField()
    grupocliente_id = serializers.PrimaryKeyRelatedField(
        source='grupocliente',
        queryset=GrupoClientes.objects.all(),
        write_only=True
    )

    class Meta:
        model = Clientes
        fields = '__all__'

    def get_grupocliente(self, obj):
        return {
            'id': obj.grupocliente.id,
            'nombre': obj.grupocliente.grupocliente
        }

#Api Tipos de Servicios
class TipoServicioSerializer(serializers.ModelSerializer):

    class Meta:
        model = TipoServicio
        fields = '__all__'

#Api Grupo de Servicios
class GrupoServicioSerializer(serializers.ModelSerializer):

    tipo = serializers.SerializerMethodField()
    tipo_id = serializers.PrimaryKeyRelatedField(
        source='tipo',
        queryset=TipoServicio.objects.all(),
        write_only=True
    )

    class Meta:
        model = GrupoServicio
        fields = '__all__'

    def get_tipo(self, obj):
        return {
            'id': obj.tipo.id,
            'nombre': obj.tipo.nombre
        }
    

#Api Ubicacion
class UbicacionSerializer(serializers.ModelSerializer):
    tipo_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoServicio.objects.all(),
        source='tipo',
        write_only=True,
        required=True
    )
    grupo_id = serializers.PrimaryKeyRelatedField(
        queryset=GrupoServicio.objects.all(),
        source='grupo',
        write_only=True,
        required=True
    )

    tipo = serializers.SerializerMethodField()
    grupo = serializers.SerializerMethodField()

    class Meta:
        model = Ubicacion
        fields = '__all__'

    def get_tipo(self, obj):
        if obj.tipo:
            return {'id': obj.tipo.id, 'nombre': obj.tipo.nombre}
        return None

    def get_grupo(self, obj):
        if obj.grupo:
            return {'id': obj.grupo.id, 'nombre': obj.grupo.grupo}
        return None


    
#Api Servicios
class ServiciosSerializer(serializers.ModelSerializer):
    tipo_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoServicio.objects.all(),
        source='tipo',
        write_only=True,
        required=True
    )
    grupo_id = serializers.PrimaryKeyRelatedField(
        queryset=GrupoServicio.objects.all(),
        source='grupo',
        write_only=True,
        required=True
    )

    tipo = serializers.SerializerMethodField()
    grupo = serializers.SerializerMethodField()

    class Meta:
        model = Servicios
        fields = '__all__'

    def get_tipo(self, obj):
        if obj.tipo:
            return {'id': obj.tipo.id, 'nombre': obj.tipo.nombre}
        return None

    def get_grupo(self, obj):
        if obj.grupo:
            return {'id': obj.grupo.id, 'nombre': obj.grupo.grupo}
        return None


#Api Tarifas
class TarifasSerializer(serializers.ModelSerializer):

    cliente_id = serializers.PrimaryKeyRelatedField(
        queryset=Clientes.objects.all(),
        source='cliente',
        write_only=True,
        required=True
    )

    tipo_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoServicio.objects.all(),
        source='tipo',
        write_only=True,
        required=True
    )
    grupo_id = serializers.PrimaryKeyRelatedField(
        queryset=GrupoServicio.objects.all(),
        source='grupo',
        write_only=True,
        required=True
    )

    servicio_id = serializers.PrimaryKeyRelatedField(
        queryset=Servicios.objects.all(),
        source='servicio',
        write_only=True,
        required=True
    )

    cliente = serializers.SerializerMethodField()
    tipo = serializers.SerializerMethodField()
    grupo = serializers.SerializerMethodField()
    servicio = serializers.SerializerMethodField()

    class Meta:
        model = Tarifas
        fields = '__all__'

    def get_cliente(self, obj):
        if obj.cliente:
            return {'id': obj.cliente.id, 'nombre': obj.cliente.cliente}
        return None

    def get_tipo(self, obj):
        if obj.tipo:
            return {'id': obj.tipo.id, 'nombre': obj.tipo.nombre}
        return None

    def get_grupo(self, obj):
        if obj.grupo:
            return {'id': obj.grupo.id, 'nombre': obj.grupo.grupo}
        return None
    
    def get_servicio(self, obj):
        if obj.servicio:
            return {'id': obj.servicio.id, 'nombre': obj.servicio.servicio}
        return None

#Api AgregarServicio
class agregarservicioSerializer(serializers.ModelSerializer):
    tipo = serializers.PrimaryKeyRelatedField(queryset=TipoServicio.objects.all())
    grupo = serializers.PrimaryKeyRelatedField(queryset=GrupoServicio.objects.all())
    ubicacion = serializers.PrimaryKeyRelatedField(queryset=Ubicacion.objects.all())
    servicio = serializers.PrimaryKeyRelatedField(queryset=Servicios.objects.all())

    class Meta:
        model = agregarservicio
        fields = '__all__'

class agregarservicioListSerializer(serializers.ModelSerializer):
    tipo = serializers.SerializerMethodField()
    grupo = serializers.SerializerMethodField()
    servicio = serializers.SerializerMethodField()
    ubicacion = serializers.SerializerMethodField()

    class Meta:
        model = agregarservicio
        fields = '__all__'

    def get_tipo(self, obj):
        return str(obj.tipo)

    def get_grupo(self, obj):
        return str(obj.grupo)

    def get_servicio(self, obj):
        return str(obj.servicio)

    def get_ubicacion(self, obj):
        return str(obj.ubicacion)