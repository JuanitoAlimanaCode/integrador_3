import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form, Select } from "antd";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { editServicios, getTipoServicios, getGrupoServiciosPorTipo } from "../../servicios/trazappservicios";

const EditarServicios = ({ serviciosId, open, onClose, listaServicios, onActualizar }) => {
    const [servicios, setServicios] = useState('');
    const [tipoServiciosId, setTipoServiciosId] = useState(null);
    const [grupoServiciosId, setGrupoServiciosId] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [tipo, setTipo] = useState([]);
    const [grupo, setGrupo] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        console.log("serviciosId:", serviciosId);
        
        if (serviciosId && listaServicios && listaServicios.length > 0) {
            const servicios = listaServicios.find(c => parseInt(c.id) === parseInt(serviciosId));
            
            if (servicios) {
                setServicios(servicios.servicio);
                setTipoServiciosId(servicios.tipo.id);
                setGrupoServiciosId(servicios.grupo.id);

                form.setFieldsValue({
                    servicio: servicios.servicio,
                    tipo: servicios.tipo.id,
                    grupo: servicios.grupo.id,                    
                });
                
            } else {
                setServicios('');
                setTipoServiciosId(null);
                setGrupoServiciosId(null);
                form.resetFields();
            }
        } else {
            setServicios('');
            setTipoServiciosId(null);
            setGrupoServiciosId(null);
            form.resetFields();
        }
    }, [serviciosId, listaServicios, form]);

    useEffect(() => {
        if (!open) {
            setServicios('');
            setTipoServiciosId(null);
            setGrupoServiciosId(null);
            form.resetFields();
        }
    }, [open, form]);

    const guardarServicios = async () => {
        try {
            const values = await form.validateFields();
            const data = {
                "id": parseInt(serviciosId, 10),
                "servicio": values.servicio,
                "grupo": values.grupo,
                "tipo": parseInt(values.tipo, 10)
            };
            console.log("Datos enviados:", data);

            await editServicios(serviciosId, data);
            await onActualizar();
            setOpenSnackbar({ open: true, message: 'Servicio actualizado correctamente', severity: 'success' });
            onClose();
        } catch (error) {
            console.error('Error al editar:', error);
            setOpenSnackbar({ open: true, message: 'Error al actualizar el Servicio', severity: 'error' });
        }
    };

    useEffect(() => {
        const obtenerTipo = async () => {
            try {
                const response = await getTipoServicios();
                setTipo(response);
            } catch (error) {
                console.error("Error al obtener grupo:", error);
            }
        };
        obtenerTipo();
    }, []);

    const obtenerGrupoServiciosPorTipo = async (tipoId) => {
    try {
        const response = await getGrupoServiciosPorTipo(tipoId);
        setGrupo(response);
        console.log("Contenido del array 'grupo':", response);
    } catch (error) {
        console.error("Error al obtener grupo por tipo:", error);
    }
    };

    // Cuando se seleccione un tipo, cargar los grupos correspondientes
    const handleTipoChange = (value) => {
    obtenerGrupoServiciosPorTipo(value);
    };


    return (
        <>
            <Drawer
                title="Editar Servicio"
                width={350}
                onClose={onClose}
                open={open}
                footer={
                    <div style={{ textAlign: "right" }}>
                        <Button onClick={onClose} style={{ marginRight: 8 }}>Cancelar</Button>
                        <Button onClick={guardarServicios} style={{ marginRight: 8 }}>Guardar</Button>
                    </div>
                }
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Servicio"
                        name="servicio"
                        rules={[{ required: true, message: "El Servicio es requerido" }]}
                    >
                        <Input placeholder="Ingrese el nombre/coordenada de la ubicación" />
                    </Form.Item>
                    <Form.Item
                        label="Tipo de Servicios"
                        name="tipo"
                        rules={[{ required: true, message: "El tipo es requerido" }]}
                    >
                        <Select placeholder="Seleccione el Tipo de Servicio" value={tipoServiciosId} onChange={handleTipoChange}>
                            {tipo.map(item => (
                                <Select.Option key={item.id} value={item.id} label={item.nombre}>
                                    {item.nombre}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Grupo de Servicios"
                        name="grupo"
                        rules={[{ required: true, message: "El grupo es requerido" }]}
                    >
                        <Select placeholder="Seleccione el Grupo de Servicio" value={grupoServiciosId}>
                            {grupo.map(item => (
                                <Select.Option key={item.id} value={item.id} label={item.grupo}>
                                    {item.grupo}
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

export default EditarServicios;