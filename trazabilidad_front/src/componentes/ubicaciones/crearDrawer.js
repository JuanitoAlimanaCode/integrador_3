import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form, Select, message } from "antd";
import { setUbicaciones, getTipoServicios, getGrupoServiciosPorTipo } from "../../servicios/trazappservicios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const DrawerUbicaciones = ({ open, onClose, listaUbicaciones, onActualizar }) => {
  
  const [tipo, setTipo] = useState([]);
  const [grupo, setGrupo] = useState([]);
  const [formulario] = Form.useForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Obtener tipos de servicio
  useEffect(() => {
    const obtenerTipoServicios = async () => {
        try {
            const response = await getTipoServicios();
            setTipo(response);
        } catch (error) {
            console.error("Error al obtener tipo:", error);
        }
    };
    obtenerTipoServicios();
  }, []);

  // Obtener grupos de servicio filtrados por tipo
  const obtenerGrupoServiciosPorTipo = async (tipoId) => {
    try {
      const response = await getGrupoServiciosPorTipo(tipoId);
      setGrupo(response);
    } catch (error) {
      console.error("Error al obtener grupo por tipo:", error);
    }
  };

  // Cuando se seleccione un tipo, cargar los grupos correspondientes
  const handleTipoChange = (value) => {
    obtenerGrupoServiciosPorTipo(value);
  };

  // Guardar nueva ubicación
  const guardarUbicaciones = async (values) => {
    try {
      const ubicacionData = {
        ubicacion: values.ubicacion,
        tipo_id: values.tipo, 
        grupo_id: values.grupo,
      };
      await setUbicaciones(ubicacionData);
      formulario.resetFields();
      await onActualizar();
      onClose();
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error', error.response?.data);
      if (error.response?.data?.ubicaciones) {
        message.error("Ya existe una ubicación con ese nombre");
      } else {
        message.error("Ocurrió un error al guardar la ubicación");
      }  
    }
  };

  return (
    <>
      <Drawer
        title="Ubicaciones"
        width={350}
        onClose={onClose}
        open={open}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>Cancelar</Button>
            <Button onClick={() => formulario.submit()} style={{ marginRight: 8 }}>Crear</Button>
          </div>
        }
      >
        <Form
          form={formulario}
          layout="vertical"
          onFinish={guardarUbicaciones}
        >
          <Form.Item
            label="Nombre de la Ubicación"
            name="ubicacion"
            rules={[{ required: true, message: "La ubicación es requerida" }]}
          >
            <Input placeholder="Ingrese el nombre de la ubicación" />
          </Form.Item>

          <Form.Item
            label="Tipo de Servicio"
            name="tipo"
            rules={[{ required: true, message: "El tipo de servicio es requerido" }]}
          >
            <Select placeholder="Seleccione el tipo de servicio" onChange={handleTipoChange}>
              {tipo.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Grupo de Servicio"
            name="grupo"
            rules={[{ required: true, message: "El grupo de servicio es requerido" }]}
          >
            <Select placeholder="Seleccione el grupo de servicio">
              {grupo.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.grupo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

        </Form>
      </Drawer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Ubicación creada correctamente
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default DrawerUbicaciones;
