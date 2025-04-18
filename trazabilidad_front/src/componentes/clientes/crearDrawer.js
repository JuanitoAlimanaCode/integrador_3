import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, InputNumber, Form, Select, message } from "antd";
import { setClientes, getGrupoClientes } from "../../servicios/trazappservicios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const DrawerClientes = ({ open, onClose, listaClientes, onActualizar }) => {
  
  const [grupos, setGrupos] = useState([]);
  const [formulario] = Form.useForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const obtenerGrupos = async () => {
    try {
        const response = await getGrupoClientes();
        return response;
    } catch (error) {
        console.error("Error al obtener grupos:", error);
        return []; // Devuelve un array vacío en caso de error
    }
};
  const guardarClientes = async (values) => {
    try {
        console.log("nitcliente value:", values.nitcliente);
        const clienteData = {
            cliente: values.cliente,
            grupocliente: values.grupocliente, 
            nitcliente: Number(values.nitcliente), 
        };
        console.log("Datos enviados a la API:", clienteData);
        await setClientes(clienteData);
        formulario.resetFields(); // ← limpia el campo
        await onActualizar();
        onClose();
        setOpenSnackbar(true);
    } catch (error) {
      console.error('Error', error.response?.data);
      if (error.response?.data?.grupocliente) {
        message.error("Ya existe un cliente con ese nombre");
      } else {
        message.error("Ocurrió un error al guardar el cliente");
      }  
    }
  };

  useEffect(() => {
    const obtenerGrupos = async () => {
        try {
            const response = await getGrupoClientes();
            setGrupos(response);
        } catch (error) {
            console.error("Error al obtener grupo:", error);
        }
    };
    obtenerGrupos();
}, []);

  return (
    <>
      <Drawer
        title="Clientes"
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
          onFinish={guardarClientes}
        >
            <Form.Item
                label="NIT del Cliente"
                name="nitcliente"
                rules={[{ required: true, message: "El NIT es requerido" }]}
            >
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                label="Nombre del Cliente"
                name="cliente"
                rules={[{ required: true, message: "El cliente es requerido" }]}
            >
                <Input placeholder="Ingrese el nombre del cliente" />
            </Form.Item>
            <Form.Item
                label="Grupo del Cliente"
                name="grupocliente"
                rules={[{ required: true, message: "El grupo es requerido" }]}
            >
                <Select placeholder="Seleccione el grupo">
                    {grupos.map(grupo => (
                        <Select.Option key={grupo.id} value={grupo.id}>
                            {grupo.grupocliente}
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
          Cliente creado correctamente
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default DrawerClientes;
