import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form, Select, message } from "antd";
import { setServicios, getTipoServicios, getGrupoServiciosPorTipo } from "../../servicios/trazappservicios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const DrawerServicios = ({ open, onClose, listaServicios, onActualizar }) => {
  
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
  const guardarServicios = async (values) => {
    try {
      const servicioData = {
        servicio: values.servicio,
        tipo_id: values.tipo, 
        grupo_id: values.grupo,
      };
      await setServicios(servicioData);
      formulario.resetFields();
      await onActualizar();
      onClose();
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error', error.response?.data);
      if (error.response?.data?.servicios) {
        message.error("Ya existe una servicio con ese nombre");
      } else {
        message.error("Ocurrió un error al guardar el servicio");
      }  
    }
  };

  return (
    <>
      <Drawer
        title="Servicios"
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
          onFinish={guardarServicios}
        >
          <Form.Item
            label="Nombre del Servicio"
            name="servicio"
            rules={[{ required: true, message: "El nombre del servicio es requerido" }]}
          >
            <Input placeholder="Ingrese el nombre del servicio" />
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

export default DrawerServicios;
