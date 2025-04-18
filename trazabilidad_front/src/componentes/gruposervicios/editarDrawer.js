import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form, InputNumber, Select } from "antd";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { editGrupoServicios, getTipoServicios } from "../../servicios/trazappservicios";

const EditaeGrupoServicios = ({ grupoServicioId, open, onClose, listaGrupoServicios, onActualizar }) => {
    const [grupoServicios, setGrupoServicios] = useState('');
    const [tipoServiciosId, setTipoServiciosId] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [tipo, setTipo] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        console.log("grupoServicioId:", grupoServicioId);
        console.log("listaGrupoServicios:", listaGrupoServicios);
        if (grupoServicioId && listaGrupoServicios && listaGrupoServicios.length > 0) {
            const gruposervicio = listaGrupoServicios.find(c => parseInt(c.id) === parseInt(grupoServicioId));
            console.log("gruposervicio encontrado:", gruposervicio);
            if (gruposervicio) {
                setGrupoServicios(gruposervicio.grupo);
                setTipoServiciosId(gruposervicio.tipo.id);
                form.setFieldsValue({
                    grupo: gruposervicio.grupo,
                    tipo: gruposervicio.tipo.id,
                });
                console.log("Valores del formulario establecidos:", { grupo: gruposervicio.grupo, tipo: gruposervicio.tipo.id });
            } else {
                setGrupoServicios('');
                setTipoServiciosId(null);
                form.resetFields();
            }
        } else {
            setGrupoServicios('');
            setTipoServiciosId(null);
            form.resetFields();
        }
    }, [grupoServicioId, listaGrupoServicios, form]);

    useEffect(() => {
        if (!open) {
            setGrupoServicios('');
            setTipoServiciosId(null);
            form.resetFields();
        }
    }, [open, form]);

    const guardarGrupoServicios = async () => {
        try {
            const values = await form.validateFields();
            const data = {
                "id": parseInt(grupoServicioId, 10),
                "grupo": values.grupo,
                "tipo": parseInt(values.tipo, 10)
            };
            console.log("Datos enviados:", data);

            await editGrupoServicios(grupoServicioId, data);
            await onActualizar();
            setOpenSnackbar({ open: true, message: 'Grupo actualizado correctamente', severity: 'success' });
            onClose();
        } catch (error) {
            console.error('Error al editar:', error);
            setOpenSnackbar({ open: true, message: 'Error al actualizar el Grupo', severity: 'error' });
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

    return (
        <>
            <Drawer
                title="Editar Grupo Servicios"
                width={350}
                onClose={onClose}
                open={open}
                footer={
                    <div style={{ textAlign: "right" }}>
                        <Button onClick={onClose} style={{ marginRight: 8 }}>Cancelar</Button>
                        <Button onClick={guardarGrupoServicios} style={{ marginRight: 8 }}>Guardar</Button>
                    </div>
                }
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Grupo Servicio"
                        name="grupo"
                        rules={[{ required: true, message: "El grupo es requerido" }]}
                    >
                        <Input placeholder="Ingrese el nombre del grupo" />
                    </Form.Item>
                    <Form.Item
                        label="Tipo de Servicios"
                        name="tipo"
                        rules={[{ required: true, message: "El tipo es requerido" }]}
                    >
                        <Select placeholder="Seleccione el Tipo de Servicio" value={tipoServiciosId}>
                            {tipo.map(item => (
                                <Select.Option key={item.id} value={item.id} label={item.nombre}>
                                    {item.nombre}
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

export default EditaeGrupoServicios;