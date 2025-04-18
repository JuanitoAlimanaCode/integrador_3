from django.db import models
from django.contrib.auth.models import User  
from django.utils.timezone import now  
from django.db.models import Q

url_ruta = 'static/assets/images'
# Create your models here.

class CentroLogistico(models.Model):
    nombrecl = models.CharField(verbose_name="Nombre Centro Logístico",max_length=50, null=False, blank=False)
    imagen = models.ImageField(upload_to=f'{url_ruta}/centros', null=True, blank=True) 

    class Meta:
        ordering = ["id"]  # Ordena por nombre alfabéticamente
        verbose_name = 'Centro Logístico'
        verbose_name_plural = 'Centros Logísticos'

    def __str__(self):
        return self.nombrecl
    
class GrupoClientes(models.Model):
    grupocliente = models.CharField(verbose_name="Nombre Grupo",max_length=50, null=False, blank=False, unique=True)
    
    class Meta:
        ordering = ["grupocliente"]  # Ordena por nombre alfabéticamente
        verbose_name = 'Grupo Cliente'
        verbose_name_plural = 'Grupos Clientes'

    def __str__(self):
        return self.grupocliente

class Clientes(models.Model):
    grupocliente = models.ForeignKey("GrupoClientes", on_delete=models.CASCADE, verbose_name="Grupo", null=False, blank=False)
    nitcliente= models.BigIntegerField(verbose_name="NIT Cliente",null=False,blank=False, unique=True)
    cliente = models.CharField(verbose_name="Nombre Cliente",max_length=100, null=False, blank=False)

    class Meta:
        ordering = ["cliente"]  # Ordena por nombre alfabéticamente
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

    def __str__(self):
        return f"{self.cliente} - {self.grupocliente}"  # Muestra "Tipo de Servicio - Grupo de Servicio"


class TipoServicio(models.Model):
    nombre = models.CharField(verbose_name="Tipo de Servicio", max_length=100, null=False, blank=False)

    class Meta:
        ordering = ["nombre"]  # Ordena por nombre alfabéticamente
        verbose_name = 'Tipo de Servicio'
        verbose_name_plural = 'Tipos de Servicios'

    def __str__(self):
        return self.nombre
    
class GrupoServicio(models.Model):
    tipo = models.ForeignKey("TipoServicio",on_delete=models.CASCADE,verbose_name="Tipo de Servicio")
    grupo = models.CharField(verbose_name="Grupo de Servicio", max_length=100, null=False, blank=False)

    class Meta:
        ordering = ["grupo"]  # Ordena por nombre alfabéticamente
        verbose_name = 'Grupo de Servicio'
        verbose_name_plural = 'Grupos de Servicios'

    def __str__(self):
        return self.grupo


class Ubicacion(models.Model):
    tipo = models.ForeignKey("TipoServicio", on_delete=models.CASCADE, verbose_name="Tipo de Servicio")
    grupo = models.ForeignKey("GrupoServicio", on_delete=models.CASCADE, verbose_name="Grupo de Servicio")
    ubicacion = models.CharField(verbose_name="Ubicación", max_length=50, null=False, blank=False)

    def __str__(self):
        return self.ubicacion

class Servicios(models.Model):
    tipo = models.ForeignKey("TipoServicio", on_delete=models.CASCADE, verbose_name="Tipo de Servicio")
    grupo = models.ForeignKey("GrupoServicio", on_delete=models.CASCADE, verbose_name="Grupo de Servicio")
    servicio = models.CharField(verbose_name="Descripción Servicio", max_length=100, null=False, blank=False)

    def __str__(self):
        return self.servicio


class Tarifas(models.Model):
    cliente = models.ForeignKey("Clientes", on_delete=models.CASCADE, verbose_name="Cliente")
    tipo = models.ForeignKey("TipoServicio", on_delete=models.CASCADE, verbose_name="Tipo de Servicio")
    grupo = models.ForeignKey("GrupoServicio", on_delete=models.CASCADE, verbose_name="Grupo de Servicio")
    servicio = models.ForeignKey("Servicios", on_delete=models.CASCADE, verbose_name="Servicio")
    tarifa = models.IntegerField(verbose_name="Tarifa", null=False, blank=False)

    def __str__(self):
        return f"{self.cliente} - {self.servicio}"

class agregarservicio(models.Model):
    VIN = models.CharField(verbose_name="VIN", max_length=17, null=True, blank=True)
    tipo = models.ForeignKey("TipoServicio", on_delete=models.CASCADE, verbose_name="Tipo de Servicio", null=False, blank=False)
    grupo = models.ForeignKey("GrupoServicio", on_delete=models.CASCADE, verbose_name="Grupo Servicio", null=False, blank=False)
    placa = models.CharField(verbose_name="Placa", max_length=6, null=True, blank=True)
    foto = models.ImageField(upload_to=f'{url_ruta}/unidades', null=True, blank=True) 
    ubicacion = models.ForeignKey("Ubicacion", on_delete=models.CASCADE, verbose_name="Ubicación", null=False, blank=False)
    servicio = models.ForeignKey("Servicios", on_delete=models.CASCADE, verbose_name="Servicio", null=False, blank=False)
    tarifa = models.IntegerField(verbose_name="Tarifas", null=False, blank=False)
    fecha = models.DateField(verbose_name="Fecha", auto_now_add=True)
    hora = models.TimeField(verbose_name="Hora", auto_now_add=True)
    latitud = models.CharField(verbose_name="Latitud", max_length=20, null=True, blank=True)
    longitud = models.CharField(verbose_name="Longitud", max_length=20, null=True, blank=True)
    centrolog = models.CharField(verbose_name="Centro Logístico", max_length=100, null=True, blank=True)
    usuario = models.CharField(verbose_name="Usuario", max_length=50, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.pk:  # Solo al crear
            self.usuario = kwargs.pop('usuario', None)  
        super().save(*args, **kwargs)

        return f"{self.VIN}{self.placa} - {self.tipo} - {self.grupo} - {self.servicio}"