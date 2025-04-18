import React, { useState } from "react";
import { Drawer, Button, Input, Form, message } from "antd";
import { setTipoServicios } from "../../servicios/trazappservicios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const DrawerTipoServicios = ({ open, onClose, listaTipoServicios, onActualizar }) => {
  
  const [formulario] = Form.useForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const guardarTipoServicios = async (values) => {
    try {
      const response = await setTipoServicios(values); // ← usamos los valores del formulario
      console.log(response);

      formulario.resetFields(); // ← limpia el campo
      await onActualizar();
      onClose();
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error', error.response?.data);
      if (error.response?.data?.grupocliente) {
        message.error("Ya existe un tipo de servicio con ese nombre");
      } else {
        message.error("Ocurrió un error al guardar el tipo de servicio");
      }  
    }
  };

  return (
    <>
      <Drawer
        title="Tipo de Servicio"
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
          onFinish={guardarTipoServicios}
        >
          <Form.Item
            label="Nombre del Tipo"
            name="nombre"
            rules={[{ required: true, message: "El nombre es requerido" }]}
          >
            <Input placeholder="Ingrese el nombre del tipo" />
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
          Grupo creado correctamente
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default DrawerTipoServicios;
