from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import *
from django.contrib.auth.models import User

@receiver(post_save, sender=User)
def crear_perfil(sender, instance, created, **kwargs):
    if created:
        perfilUsuario.objects.create(user=instance)

@receiver(post_save, sender=User)
def guardar_perfil(sender, instance, created, **kwargs):
    instance.perfilUsuario.save()