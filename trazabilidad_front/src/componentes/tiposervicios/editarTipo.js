import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form } from "antd";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { editTipoServicios } from "../../servicios/trazappservicios";

const EditarTipoServicios = ({ tiposerviciosId, open, onClose, listaTipoServicios, onActualizar }) => {
  
  const [nombreTipoServicios, setNombreTipoServicios] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (open && tiposerviciosId && listaTipoServicios?.length > 0) {
      const tipo = listaTipoServicios.find(c => parseInt(c.id) === parseInt(tiposerviciosId));
      console.log("TIPO ENCONTRADO:", tipo);
      if (tipo && tipo.nombre) {
        setNombreTipoServicios(tipo.nombre);
      } else {
        setNombreTipoServicios(''); // Asegura que el input esté vacío si no se encuentra el grupo
      }
    } else {
        setNombreTipoServicios(''); // Asegura que el input esté vacío si no hay datos
    }
  }, [tiposerviciosId, listaTipoServicios, open]);
   
  useEffect(() => {
    if (!open) {
      setNombreTipoServicios('');
    }
  }, [open]);

  const guardarTipoServicios = async () => {
    try {
      const data = 
      {
        "id": parseInt(tiposerviciosId, 10),
        "nombre": nombreTipoServicios
      }
      

      await editTipoServicios(tiposerviciosId, data);
      await onActualizar();
      setOpenSnackbar({ open: true, message: 'Tipo de Servicio actualizado correctamente', severity: 'success' });
      onClose();
    } catch (error) {
      console.error('Error al editar:', error);
      setOpenSnackbar({ open: true, message: 'Error al actualizar el Tipo de Servicio', severity: 'error' });
    }
  };

  return (
    <>
      <Drawer
        title="Editar Tipo Servicio"
        width={350}
        onClose={onClose}
        open={open}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>Cancelar</Button>
            <Button onClick={guardarTipoServicios} style={{ marginRight: 8 }}>Guardar</Button>
          </div>
        }
      >
        <Form layout="vertical">
          <Form.Item label="Nombre del Tipo de Servicio" required>
            <Input
              value={nombreTipoServicios}
              onChange={(e) => {setNombreTipoServicios(e.target.value);
                console.log(e.target.value);}
              }
              placeholder="Ingrese el nombre del tipo de servicio"
            />
          </Form.Item>
        </Form>
      </Drawer>

      <Snackbar
        open={openSnackbar.open}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })} severity={openSnackbar.severity} sx={{ width: '100%' }}>
          {openSnackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default EditarTipoServicios;
