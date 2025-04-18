import React, { useState } from "react";
import { Drawer, Button, Input, Form, Upload } from "antd";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { setCentrosLog } from "../../servicios/trazappservicios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const DrawerCentrosLog = ({ open, onClose, listaCentrosLog, onActualizar }) => {
  
  const [formualrio] = Form.useForm();
  
  const [nombrecl, setNombrecl] = useState('');
  const [imagen, setImagen] = useState('');

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const guararCentroLogistico = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('imagen', imagen);
      formData.append('nombrecl', nombrecl); 

      const response = await setCentrosLog(formData);
      console.log(response);
      setNombrecl('');
      setImagen(null);
      await onActualizar();
      onClose();
      setOpenSnackbar(true);
    } catch (error) {
      console.log('Error',error);
    }
  }
    
  
  return (
    <>
      <Drawer
        title="Centros Logísticos"
        width={350}
        onClose={onClose}
        open={open}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>Cancelar</Button>
            <Button onClick={guararCentroLogistico} style={{ marginRight: 8 }}>Crear</Button>
          </div>
        }
      >
        <Form layout="vertical">
          <Form.Item label="Nombre del Centro Logístico"
            name="centrologistico"
            rules={[{ required: true, message: "El centro logístico es requerido" }]}>
            <Input
              value={nombrecl}
              onChange={(e) => setNombrecl(e.target.value)}
              placeholder="Ingrese el nombre"
            />
          </Form.Item>

          <Form.Item label="Imagen"
            name="imagen"
            extra="Seleccione una imagen para el centro logístico">
            <Upload
              beforeUpload={(file) => {
                setImagen(file);
                return false; 
              }}
              showUploadList={false}
              onChange={(e) => setImagen(e.file)}
            >
              <Button
                icon={<CloudUploadIcon />}
                style={{
                  backgroundColor: "#10295E",
                  color: "#ffffff",
                  marginBottom: "16px",
                  border: "none",
                }}
              >
                Seleccionar Imagen
              </Button>
            </Upload>
            {imagen && <p style={{ marginTop: 10 }}>Imagen seleccionada: {imagen.name}</p>}
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
          Centro creado correctamente
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default DrawerCentrosLog;
