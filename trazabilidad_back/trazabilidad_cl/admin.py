from django.contrib import admin
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import *

class ClientesAdmin(admin.ModelAdmin):
    list_display = ['nitcliente', 'cliente', 'grupocliente']
    search_fields = ['cliente']
    list_editable = ['cliente']

class UbicacionAdmin(admin.ModelAdmin):
    list_display = ['tipo', 'grupo', 'ubicacion']
    search_fields = ['ubicacion']
    list_editable = ['ubicacion']

class ServiciosAdmin(admin.ModelAdmin):
    list_display = ['tipo', 'grupo', 'servicio']
    search_fields = ['servicio']
    list_editable = ['servicio']

class TarifasAdmin(admin.ModelAdmin):
    list_display = ['tipo', 'grupo', 'servicio', 'tarifa']
    search_fields = ['tarifa']
    list_editable = ['tarifa']

class AgregarAdmin(admin.ModelAdmin):
    list_display = ['VIN', 'placa', 'tipo', 'grupo', 'ubicacion', 'servicio', 'tarifa']
    search_fields = ['VIN', 'placa']
    list_filter = ['fecha']
    ordering = ['-fecha']
    readonly_fields = ['fecha', 'hora', 'latitud', 'longitud', 'centrolog', 'usuario']
    date_hierarchy = 'fecha'

# Register your models here.
admin.site.register(CentroLogistico)
admin.site.register(GrupoClientes)
admin.site.register(Clientes, ClientesAdmin)
admin.site.register(TipoServicio)
admin.site.register(GrupoServicio)
admin.site.register(Ubicacion, UbicacionAdmin)
admin.site.register(Servicios, ServiciosAdmin)
admin.site.register(Tarifas, TarifasAdmin)
admin.site.register(agregarservicio, AgregarAdmin)




