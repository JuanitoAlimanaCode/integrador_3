import React, { useState } from "react";
import { Drawer, Button, Input, Form, message } from "antd";
import { setGrupoClientes } from "../../servicios/trazappservicios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const DrawerGrupoClientes = ({ open, onClose, listaGrupoClientes, onActualizar }) => {
  
  const [formulario] = Form.useForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const guardarGrupoClientes = async (values) => {
    try {
      const response = await setGrupoClientes(values); // ← usamos los valores del formulario
      console.log(response);

      formulario.resetFields(); // ← limpia el campo
      await onActualizar();
      onClose();
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error', error.response?.data);
      if (error.response?.data?.grupocliente) {
        message.error("Ya existe un grupo con ese nombre");
      } else {
        message.error("Ocurrió un error al guardar el grupo");
      }  
    }
  };

  return (
    <>
      <Drawer
        title="Grupo Clientes"
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
          onFinish={guardarGrupoClientes}
        >
          <Form.Item
            label="Nombre del Grupo"
            name="grupocliente"
            rules={[{ required: true, message: "El grupo es requerido" }]}
          >
            <Input placeholder="Ingrese el nombre del grupo" />
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

export default DrawerGrupoClientes;
