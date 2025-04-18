from django import forms
from .models import *

class centrosForm(forms.ModelForm):

    class Meta:
        model = CentroLogistico
        fields = ['nombrecl']
        widgets = {
            'nombrecl': forms.TextInput(
                attrs={
                    'class': 'form-control-2', 
                }
            )
        }

class grclientesForm(forms.ModelForm):

    class Meta:
        model = GrupoClientes
        fields = ['grupocliente']
        widgets = {
            'grupocliente': forms.TextInput(
                attrs={
                    'class': 'form-control-2', 
                }
            )
        }

class clientesForm(forms.ModelForm):

    class Meta:
        model = Clientes
        fields = ['grupocliente','nitcliente','cliente']
        widgets = {
            'grupocliente': forms.Select(attrs={'class': 'form-control-2'}),
            'nitcliente': forms.NumberInput(attrs={'class': 'form-control-2', 'min': '0'}),
            'cliente': forms.TextInput(attrs={'class': 'form-control-2'}),
        }