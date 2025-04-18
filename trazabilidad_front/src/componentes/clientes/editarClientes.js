import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form, InputNumber, Select } from "antd";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { editClientes, getGrupoClientes } from "../../servicios/trazappservicios";

const EditarClientes = ({ ClienteId, open, onClose, listaClientes, onActualizar }) => {
    const [nombreCliente, setNombreCliente] = useState('');
    const [nitCliente, setNitCliente] = useState(null);
    const [grupoClienteId, setGrupoClienteId] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [grupos, setGrupos] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (ClienteId && listaClientes && listaClientes.length > 0) {
            const cliente = listaClientes.find(c => parseInt(c.id) === parseInt(ClienteId));
            if (cliente) {
                setNombreCliente(cliente.cliente);
                setNitCliente(cliente.nitcliente);
                setGrupoClienteId(cliente.grupocliente.id);
                form.setFieldsValue({
                    nitcliente: cliente.nitcliente,
                    cliente: cliente.cliente,
                    grupocliente: cliente.grupocliente.id,
                });
            } else {
                setNombreCliente('');
                setNitCliente(null);
                setGrupoClienteId(null);
                form.resetFields();
            }
        } else {
            setNombreCliente('');
            setNitCliente(null);
            setGrupoClienteId(null);
            form.resetFields();
        }
    }, [ClienteId, listaClientes, form]);

    useEffect(() => {
        if (!open) {
            setNombreCliente('');
            setNitCliente(null);
            setGrupoClienteId(null);
            form.resetFields();
        }
    }, [open, form]);

      const guardarCliente = async () => {
          try {
              const values = await form.validateFields();
              const data = {
                  "id": parseInt(ClienteId, 10),
                  "cliente": values.cliente,
                  "grupocliente": parseInt(values.grupocliente, 10)
              };
              console.log("Datos enviados:", data);

              await editClientes(ClienteId, data);
              await onActualizar();
              setOpenSnackbar({ open: true, message: 'Cliente actualizado correctamente', severity: 'success' });
              onClose();
          } catch (error) {
              console.error('Error al editar:', error);
              setOpenSnackbar({ open: true, message: 'Error al actualizar el Cliente', severity: 'error' });
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
                title="Editar Cliente"
                width={350}
                onClose={onClose}
                open={open}
                footer={
                    <div style={{ textAlign: "right" }}>
                        <Button onClick={onClose} style={{ marginRight: 8 }}>Cancelar</Button>
                        <Button onClick={guardarCliente} style={{ marginRight: 8 }}>Guardar</Button>
                    </div>
                }
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="NIT del Cliente"
                        name="nitcliente"
                        rules={[{ required: true, message: "El NIT es requerido" }]}
                    >
                        <InputNumber style={{ width: '100%' }} disabled />
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
                                <Select.Option key={grupo.id} value={grupo.id} label={grupo.grupocliente}>
                                    {grupo.grupocliente}
                                </Select.Option>
                            ))}
                        </Select>
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

export default EditarClientes;