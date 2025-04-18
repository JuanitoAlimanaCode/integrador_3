import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form, Upload } from "antd";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { editCentrosLog } from "../../servicios/trazappservicios";

const EditarCentrosLog = ({ centrologId, open, onClose, listaCentrosLog, onActualizar }) => {
  const [nombrecl, setNombrecl] = useState('');
  const [imagen, setImagen] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (centrologId && listaCentrosLog.length > 0) {
      const centro = listaCentrosLog.find(c => c.id === Number(centrologId));
      if (centro) {
        setNombrecl(centro.nombrecl || '');
        setImagen(null); // No cargamos imagen por ahora
      }
    }
  }, [centrologId, listaCentrosLog]);

  useEffect(() => {
    if (!open) {
      setNombrecl('');
      setImagen(null);
    }
  }, [open]);

  const guardarCentroLogistico = async () => {
    try {
      const formData = new FormData();
      formData.append('nombrecl', nombrecl);
      if (imagen) {
        formData.append('imagen', imagen);
      }
      
      // VERIFICAR CONTENIDO DE FORM DATA
      for (let pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]);
      }

      await editCentrosLog(centrologId, formData);
      await onActualizar();
      setOpenSnackbar(true);
      onClose();
    } catch (error) {
      console.error('Error al editar:', error);
    }
  };


  return (
    <>
      <Drawer
        title="Editar Centro Logístico"
        width={350}
        onClose={onClose}
        open={open}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>Cancelar</Button>
            <Button onClick={guardarCentroLogistico} style={{ marginRight: 8 }}>Guardar</Button>
          </div>
        }
      >
        <Form layout="vertical">
          <Form.Item label="Nombre del Centro Logístico" required>
            <Input
              value={nombrecl}
              onChange={(e) => setNombrecl(e.target.value)}
              placeholder="Ingrese el nombre"
            />
          </Form.Item>

          <Form.Item label="Imagen" extra="Seleccione una imagen para actualizar (opcional)">
            <Upload
              beforeUpload={(file) => {
                setImagen(file);
                return false;
              }}
              showUploadList={false}
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
          Centro actualizado correctamente
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default EditarCentrosLog;
