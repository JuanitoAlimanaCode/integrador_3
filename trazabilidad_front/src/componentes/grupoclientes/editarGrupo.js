import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form } from "antd";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { editGrupoClientes } from "../../servicios/trazappservicios";

const EditarGrupoCliente = ({ grupoClienteId, open, onClose, listaGrupoClientes, onActualizar }) => {
  console.log('grupoClienteId en EditarGrupoClientes:', grupoClienteId);
  
  const [nombreGrupoCliente, setNombreGrupoCliente] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    console.log('grupoClienteId:', grupoClienteId);
    console.log('listaGrupoClientes:', listaGrupoClientes);
    if (grupoClienteId && listaGrupoClientes && listaGrupoClientes.length > 0) {
      const grupo = listaGrupoClientes.find(c => parseInt(c.id) === parseInt(grupoClienteId));
      if (grupo && grupo.grupocliente) {
        setNombreGrupoCliente(grupo.grupocliente);
      } else {
        setNombreGrupoCliente(''); // Asegura que el input esté vacío si no se encuentra el grupo
      }
    } else {
        setNombreGrupoCliente(''); // Asegura que el input esté vacío si no hay datos
    }
  }, [grupoClienteId, listaGrupoClientes]);

  useEffect(() => {
    if (!open) {
      setNombreGrupoCliente('');
    }
  }, [open]);

  const guardarGrupoCliente = async () => {
    try {
      const data = 
      {
        "id": parseInt(grupoClienteId, 10),
        "grupocliente": nombreGrupoCliente
      }
      

      await editGrupoClientes(grupoClienteId, data);
      await onActualizar();
      setOpenSnackbar({ open: true, message: 'Grupo Cliente actualizado correctamente', severity: 'success' });
      onClose();
    } catch (error) {
      console.error('Error al editar:', error);
      setOpenSnackbar({ open: true, message: 'Error al actualizar el Grupo Cliente', severity: 'error' });
    }
  };

  return (
    <>
      <Drawer
        title="Editar Grupo Cliente"
        width={350}
        onClose={onClose}
        open={open}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>Cancelar</Button>
            <Button onClick={guardarGrupoCliente} style={{ marginRight: 8 }}>Guardar</Button>
          </div>
        }
      >
        <Form layout="vertical">
          <Form.Item label="Nombre del Grupo Cliente" required>
            <Input
              value={nombreGrupoCliente}
              onChange={(e) => {setNombreGrupoCliente(e.target.value);
                console.log(e.target.value);}
              }
              placeholder="Ingrese el nombre del grupo"
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

export default EditarGrupoCliente;
