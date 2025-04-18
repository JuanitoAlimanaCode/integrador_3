import pandas as pd
from trazabilidad_cl.models import Servicios, TipoServicio, GrupoServicio

# Carga el CSV
df = pd.read_csv("C:/Users/jcben/Downloads/servicios.csv")  # Reemplaza con la ruta real

# Lista para almacenar los objetos antes de insertarlos masivamente
servicios_a_insertar = []

for _, row in df.iterrows():
    # Busca los objetos en TipoServicio y GrupoServicio
    tipo_servicio = TipoServicio.objects.filter(id=row["tipo"]).first()
    grupo_servicio = GrupoServicio.objects.filter(id=row["grupo"]).first()

    # Si existen ambos, crea el servicio
    if tipo_servicio and grupo_servicio:
        servicio = Servicios(
            tipo=tipo_servicio,
            grupo=grupo_servicio,
            servicio=row["servicio"]
        )
        servicios_a_insertar.append(servicio)

# Inserta todo de una sola vez
Servicios.objects.bulk_create(servicios_a_insertar)

print("✅ Datos importados con éxito")