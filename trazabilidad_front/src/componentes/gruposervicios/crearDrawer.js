import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, InputNumber, Form, Select, message } from "antd";
import { setGrupoServicios, getTipoServicios } from "../../servicios/trazappservicios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const DrawerGrupoServicios = ({ open, onClose, listaGrupoServicios, onActualizar }) => {
  
  const [tipo, setTipo] = useState([]);
  const [formulario] = Form.useForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const obtenerTipoServicios = async () => {
    try {
        const response = await getTipoServicios();
        return response;
    } catch (error) {
        return [];
    }
};
  const guardarGrupoServicios = async (values) => {
    try {
        console.log("Valores antes de enviar:", values);
        const grupoData = {
            grupo: values.grupo,
            tipo_id: values.tipo, 
        };
        console.log('Datos que se están enviando:', grupoData);
        await setGrupoServicios(grupoData);
        formulario.resetFields(); 
        await onActualizar();
        onClose();
        setOpenSnackbar(true);
    } catch (error) {
      console.error('Error', error.response?.data);
      if (error.response?.data?.grupocliente) {
        message.error("Ya existe un grupo de servicio con ese nombre");
      } else {
        message.error("Ocurrió un error al guardar el grupo de servicio");
      }  
    }
  };

  useEffect(() => {
    const obtenerTipoServicios = async () => {
        try {
            const response = await getTipoServicios();
            console.log("Respuesta de tipo:", response); 
            setTipo(response);
        } catch (error) {
            console.error("Error al obtener tipo:", error);
        }
    };
    obtenerTipoServicios();
}, []);

  return (
    <>
      <Drawer
        title="Grupo de Servicio"
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
          onFinish={guardarGrupoServicios}
        >
            <Form.Item
                label="Nombre del Grupo de Servicio"
                name="grupo"
                rules={[{ required: true, message: "El nombre de grupo es requerido" }]}
            >
                <Input placeholder="Ingrese el grupo de servicio" />
            </Form.Item>
            <Form.Item
                label="Tipo de Servicio"
                name="tipo"
                rules={[{ required: true, message: "El tipo de servicio es requerido" }]}
            >
                <Select placeholder="Seleccione el tipo de servicio">
                    {tipo.map(item => (
                        
                        <Select.Option key={item.id} value={item.id}>
                            {item.nombre}
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
          Grupo de servicio creado correctamente
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default DrawerGrupoServicios;
