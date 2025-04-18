import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form, Select } from "antd";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { editUbicaciones, getTipoServicios, getGrupoServiciosPorTipo } from "../../servicios/trazappservicios";

const EditarUbicaciones = ({ ubicacionesId, open, onClose, listaUbicaciones, onActualizar }) => {
    const [ubicaciones, setUbicaciones] = useState('');
    const [tipoServiciosId, setTipoServiciosId] = useState(null);
    const [grupoServiciosId, setGrupoServiciosId] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [tipo, setTipo] = useState([]);
    const [grupo, setGrupo] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        console.log("ubicacionesId:", ubicacionesId);
        
        if (ubicacionesId && listaUbicaciones && listaUbicaciones.length > 0) {
            const ubicaciones = listaUbicaciones.find(c => parseInt(c.id) === parseInt(ubicacionesId));
            
            if (ubicaciones) {
                setUbicaciones(ubicaciones.ubicacion);
                setTipoServiciosId(ubicaciones.tipo.id);
                setGrupoServiciosId(ubicaciones.grupo.id);

                form.setFieldsValue({
                    ubicacion: ubicaciones.ubicacion,
                    tipo: ubicaciones.tipo.id,
                    grupo: ubicaciones.grupo.id,                    
                });
                
            } else {
                setUbicaciones('');
                setTipoServiciosId(null);
                setGrupoServiciosId(null);
                form.resetFields();
            }
        } else {
            setUbicaciones('');
            setTipoServiciosId(null);
            setGrupoServiciosId(null);
            form.resetFields();
        }
    }, [ubicacionesId, listaUbicaciones, form]);

    useEffect(() => {
        if (!open) {
            setUbicaciones('');
            setTipoServiciosId(null);
            setGrupoServiciosId(null);
            form.resetFields();
        }
    }, [open, form]);

    const guardarUbicaciones = async () => {
        try {
            const values = await form.validateFields();
            const data = {
                "id": parseInt(ubicacionesId, 10),
                "ubicacion": values.ubicacion,
                "grupo": values.grupo,
                "tipo": parseInt(values.tipo, 10)
            };
            console.log("Datos enviados:", data);

            await editUbicaciones(ubicacionesId, data);
            await onActualizar();
            setOpenSnackbar({ open: true, message: 'Ubicación actualizado correctamente', severity: 'success' });
            onClose();
        } catch (error) {
            console.error('Error al editar:', error);
            setOpenSnackbar({ open: true, message: 'Error al actualizar la Ubicación', severity: 'error' });
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
                title="Editar Ubicación"
                width={350}
                onClose={onClose}
                open={open}
                footer={
                    <div style={{ textAlign: "right" }}>
                        <Button onClick={onClose} style={{ marginRight: 8 }}>Cancelar</Button>
                        <Button onClick={guardarUbicaciones} style={{ marginRight: 8 }}>Guardar</Button>
                    </div>
                }
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Ubicación"
                        name="ubicacion"
                        rules={[{ required: true, message: "La ubicación es requerido" }]}
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

export default EditarUbicaciones;