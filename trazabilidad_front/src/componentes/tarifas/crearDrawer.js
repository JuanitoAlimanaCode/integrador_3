import React, { useState, useEffect } from "react";
import { Drawer, Button, InputNumber, Form, Select, message } from "antd";
import { setTarifas, getClientes, getTipoServicios, getGrupoServiciosPorTipo, getServiciosPorTipoYGrupo } from "../../servicios/trazappservicios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const DrawerTarifas = ({ open, onClose, listaTarifas, onActualizar }) => {
  
  const [cliente, setCliente] = useState([]);
  const [tipo, setTipo] = useState([]);
  const [grupo, setGrupo] = useState([]);
  const [servicio, setServicio] = useState([]);
  const [formulario] = Form.useForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

  useEffect(() => {
    const obtenerCliente = async () => {
        try {
            const response = await getClientes();
            setCliente(response);
        } catch (error) {
            console.error("Error al obtener tipo:", error);
        }
    };
    obtenerCliente();
  }, []);

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

  // Obtener servicios filtrados por tipo y grupo
  const obtenerServiciosPorTipoYGrupo = async (tipoId, grupoId) => {
    try {
      const response = await getServiciosPorTipoYGrupo(tipoId, grupoId);
      setServicio(response || []);
    } catch (error) {
      console.error("Error al obtener servicios por tipo y grupo:", error);
    }
  };

  // Cuando se seleccione un tipo, cargar los grupos correspondientes
  const handleTipoChange = (value) => {
    setTipoSeleccionado(value);
    obtenerGrupoServiciosPorTipo(value);
    formulario.setFieldsValue({ grupo: undefined, servicio: undefined });
    setServicio([]);
  };

  const handleGrupoChange = (value) => {
    if (tipoSeleccionado) {
      obtenerServiciosPorTipoYGrupo(tipoSeleccionado, value);
    } else {
      console.warn("Tipo no seleccionado aún");
    }
  };

  const guardarTarifas = async (values) => {
    try {
      const tarifaData = {
        
        cliente_id: values.cliente,
        tipo_id: values.tipo, 
        grupo_id: values.grupo,
        servicio_id: values.servicio,
        tarifa: values.tarifa,
      };
      await setTarifas(tarifaData);
      formulario.resetFields();
      await onActualizar();
      onClose();
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error', error.response?.data);
      if (error.response?.data?.servicios) {
        message.error("Ya existe una tarifa con esa configuración");
      } else {
        message.error("Ocurrió un error al guardar la tarifa");
      }  
    }
  };

  return (
    <>
      <Drawer
        title="Tarifas"
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
          onFinish={guardarTarifas}
        >
          <Form.Item
            label="Cliente"
            name="cliente"
            rules={[{ required: true, message: "El nombre del cliente es requerido" }]}
          >
            <Select placeholder="Seleccione cliente">
              {cliente.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.cliente}
                </Select.Option>
              ))}
            </Select>
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
            <Select placeholder="Seleccione el grupo de servicio" onChange={handleGrupoChange}>
              {grupo.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.grupo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Servicio"
            name="servicio"
            rules={[{ required: true, message: "El servicio es requerido" }]}
          >
            <Select placeholder="Seleccione un servicio">
              {servicio.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.servicio}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            label="Tarifa"
            name="tarifa"
            rules={[{ required: true, message: "La tarifa es requerida" }]}
          >
            <InputNumber style={{ width: '100%' }} />
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
          Tarifa creada correctamente
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default DrawerTarifas;
