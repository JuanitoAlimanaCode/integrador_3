import axios from "axios";  
import apiURL from "../componentes/UrlBackend";

const api = axios.create({
    baseURL: `${apiURL}api/`
  });
  
  // Y luego en cada petición agrega el token dinámicamente:
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });




//Centros Logísticos
export const getCentrosLog = async () => {
    const response = await api.get(`centros_log/`);
    return response.data;    
}

export const setCentrosLog = async (formData) => {
  const response = await api.post(`centros_log/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const editCentrosLog = async (id, datos) => {
  
  const response = await api.put(`centros_log/${id}/`, datos, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteCentrosLog = async (id) => {
  const response = await api.delete(`centros_log/${id}/`);
  return response.data;
}




//Grupo Clientes
export const getGrupoClientes = async () => {
  const response = await api.get(`grupocliente/`);
  return response.data;    
}

export const setGrupoClientes = async (datos) => {
  console.log(datos)
const response = await api.post(`grupocliente/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};

export const editGrupoClientes = async (id, datos) => {

const response = await api.put(`grupocliente/${id}/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};

export const deleteGrupoClientes = async (id) => {
const response = await api.delete(`grupocliente/${id}/`);
return response.data;
}





//Grupo Clientes
export const getClientes = async () => {
  const response = await api.get(`clientes/`);
  return response.data;    
}

export const setClientes = async (datos) => {
  const response = await api.post(`clientes/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};

export const editClientes = async (id, datos) => {

const response = await api.put(`clientes/${id}/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};

export const deleteClientes = async (id) => {
const response = await api.delete(`clientes/${id}/`);
return response.data;
}





//Ubicaciones
export const getUbicaciones = async () => {
  const response = await api.get(`ubicacion/`);
  return response.data;    
}

export const setUbicaciones = async (datos) => {
  console.log(datos)
const response = await api.post(`ubicacion/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};

export const editUbicaciones = async (id, datos) => {

const response = await api.put(`ubicacion/${id}/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};

export const deleteUbicaciones = async (id) => {
const response = await api.delete(`ubicacion/${id}/`);
return response.data;
}





//Tipo de Servicios
export const getTipoServicios = async () => {
  const response = await api.get(`tipo/`);
  return response.data;    
}

export const setTipoServicios = async (datos) => {
  console.log(datos)
const response = await api.post(`tipo/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};

export const editTipoServicios = async (id, datos) => {

const response = await api.put(`tipo/${id}/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};

export const deleteTipoServicios = async (id) => {
const response = await api.delete(`tipo/${id}/`);
return response.data;
}





//Grupo de Servicios
export const getGrupoServicios = async () => {
  const response = await api.get(`grupo/`);
  return response.data;    
}

export const setGrupoServicios = async (datos) => {
  console.log(datos)
const response = await api.post(`grupo/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};

export const editGrupoServicios = async (id, datos) => {

const response = await api.put(`grupo/${id}/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};

export const deleteGrupoServicios = async (id) => {
const response = await api.delete(`grupo/${id}/`);
return response.data;
}


//Dependencia de Grupo de Servicios a Tipo de Servicios
export const getGrupoServiciosPorTipo = async (tipoId) => {
  if (!tipoId) {
    console.error("El tipoId no está definido.");
    return;
  }
  try {
    const response = await api.get(`grupos_por_tipo/${tipoId}/`);
    if (response.data) {
      console.log("Grupos de servicio obtenidos:", response.data);
      return response.data;
    } else {
      throw new Error("Respuesta no exitosa del servidor");
    }
  } catch (error) {
    console.error("Error al obtener los grupos de servicio:", error);
    throw error;
  }
};





//Descripción Servicios
export const getServicios = async () => {
  const response = await api.get(`servicios/`);
  return response.data;    
}

export const setServicios = async (datos) => {
  console.log(datos)
const response = await api.post(`servicios/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};

export const editServicios = async (id, datos) => {

const response = await api.put(`servicios/${id}/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};

export const deleteServicios = async (id) => {
const response = await api.delete(`servicios/${id}/`);
return response.data;
}





//Tarifas
export const getTarifas = async () => {
  const response = await api.get(`tarifas/`);
  return response.data;    
}

export const setTarifas = async (datos) => {
  console.log(datos)
const response = await api.post(`tarifas/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};

export const editTarifas = async (id, datos) => {

const response = await api.put(`tarifas/${id}/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};

export const deleteTarifas = async (id) => {
const response = await api.delete(`tarifas/${id}/`);
return response.data;
}

//Dependencia por tipo y grupo
export const getServiciosPorTipoYGrupo = async (tipoId, grupoId) => {
  if (!tipoId) {
    console.error("El tipoId no está definido.");
    return []; // Devuelve un array vacío en lugar de null para evitar errores en el componente
  }

  if (!grupoId) {
    console.error("El grupoId no está definido.");
    return []; // Devuelve un array vacío
  }

  try {
    // 1. Obtener los servicios por tipo y grupo
    const serviciosResponse = await api.get(`servicios_por_grupo/${tipoId}/${grupoId}/`);

    if (!serviciosResponse.data) {
      console.warn("No se encontraron servicios para el tipo y grupo especificados.");
      return []; // Devuelve un array vacío si no hay servicios
    }

    console.log("Servicios obtenidos:", serviciosResponse.data);
    return serviciosResponse.data;

  } catch (error) {
    console.error("Error al obtener los servicios por tipo y grupo:", error);
    throw error; // Re-lanza el error para que el componente padre pueda manejarlo
  }
};


export const getUbicacionPorTipoYGrupo = async (tipoId, grupoId) => {
  if (!tipoId) {
    console.error("El tipoId no está definido.");
    return []; // Devuelve un array vacío en lugar de null para evitar errores en el componente
  }

  if (!grupoId) {
    console.error("El grupoId no está definido.");
    return []; // Devuelve un array vacío
  }

  try {
    // 1. Obtener los servicios por tipo y grupo
    const ubicacionResponse = await api.get(`ubicacion_por_grupo/${tipoId}/${grupoId}/`);

    if (!ubicacionResponse.data) {
      console.warn("No se encontraron ubicaciones para el tipo y grupo especificados.");
      return []; // Devuelve un array vacío si no hay servicios
    }

    console.log("Ubicaciones obtenidas:", ubicacionResponse.data);
    return ubicacionResponse.data;

  } catch (error) {
    console.error("Error al obtener ubicaciones por tipo y grupo:", error);
    throw error; // Re-lanza el error para que el componente padre pueda manejarlo
  }
};


//Agregar Operativa
export const getAgregarPorVIN = async (vin) => {
  const response = await api.get(`agregar/?vin=${vin}`);
  return response.data;
}

export const setAgregar = async (datos) => {
  console.log(datos)
const response = await api.post(`agregar/`, datos, {
  headers: {
    "Content-Type": "application/json",
  },
});
return response.data;
};