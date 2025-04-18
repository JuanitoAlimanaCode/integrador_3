import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, Form, Select, InputNumber } from "antd";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { editTarifas, getClientes, getTipoServicios, getGrupoServiciosPorTipo, getServiciosPorTipoYGrupo, setClientes } from "../../servicios/trazappservicios";

const EditarTarifas = ({ tarifasId, open, onClose, listaTarifas, onActualizar }) => {
    const [tarifas, setTarifas] = useState('');
    const [clientesId, setClientesId] = useState(null);
    const [tipoServiciosId, setTipoServiciosId] = useState(null);
    const [grupoServiciosId, setGrupoServiciosId] = useState(null);
    const [serviciosId, setServiciosId] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [cliente, setCliente] = useState([]);
    const [tipo, setTipo] = useState([]);
    const [grupo, setGrupo] = useState([]);
    const [servicio, setServicio] = useState([]);
    const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        
        if (tarifasId && listaTarifas && listaTarifas.length > 0) {
            const tarifas = listaTarifas.find(c => parseInt(c.id) === parseInt(tarifasId));
            
            if (tarifas) {
                setClientesId(tarifas.cliente.id);
                setTipoServiciosId(tarifas.tipo.id);
                setGrupoServiciosId(tarifas.grupo.id);
                setServiciosId(tarifas.servicio.id);
                setTarifas(tarifas.tarifa);

                form.setFieldsValue({
                    cliente: tarifas.cliente.id,
                    tipo: tarifas.tipo.id,
                    grupo: tarifas.grupo.id,  
                    servicio: tarifas.servicio.id,
                    tarifa: tarifas.tarifa,
                });
                
            } else {
                setClientesId(null);
                setTipoServiciosId(null);
                setGrupoServiciosId(null);
                setServiciosId(null);
                setTarifas('');
                form.resetFields();
            }
        } else {
            setClientesId(null);
            setTipoServiciosId(null);
            setGrupoServiciosId(null);
            setServiciosId(null);
            setTarifas('');
            form.resetFields();
        }
    }, [tarifasId, listaTarifas, form]);

    useEffect(() => {
        if (!open) {
            setClientesId(null);
            setTipoServiciosId(null);
            setGrupoServiciosId(null);
            setServiciosId(null);
            setTarifas('');
            form.resetFields();
        }
    }, [open, form]);

    const guardarTarifas = async () => {
        try {
            const values = await form.validateFields();
            const data = {
                "id": parseInt(tarifasId, 10),
                "cliente": values.cliente,
                "tipo": parseInt(values.tipo, 10),
                "grupo": parseInt(values.grupo,10),
                "servicio": parseInt(values.servicio,10),
                "tarifa": values.tarifa
            };
            console.log("Datos enviados:", data);
            await editTarifas(tarifasId, data);
            await onActualizar();
            setOpenSnackbar({ open: true, message: 'Tarifa actualizada correctamente', severity: 'success' });
            onClose();
        } catch (error) {
            console.error('Error al editar:', error);
            setOpenSnackbar({ open: true, message: 'Error al actualizar la Tarifa', severity: 'error' });
        }
    };

    useEffect(() => {
        const obtenerCliente = async () => {
            try {
                const response = await getClientes();
                setCliente(response);
            } catch (error) {
                console.error("Error al obtener tipo:", error);
            }
        };
        obtenerCliente();
    }, []);    

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

    const obtenerServiciosPorTipoYGrupo = async (tipoId, grupoId) => {
        try {
          const response = await getServiciosPorTipoYGrupo(tipoId, grupoId);
          setServicio(response || []);
        } catch (error) {
          console.error("Error al obtener servicios por tipo y grupo:", error);
        }
      };
    // Cuando se seleccione un tipo, cargar los grupos correspondientes
    const handleTipoChange = (value) => {
    setTipoSeleccionado(value);
    obtenerGrupoServiciosPorTipo(value);
    form.setFieldsValue({ grupo: undefined, servicio: undefined });
    setServicio([]);
    };

    const handleGrupoChange = (value) => {
    if (tipoSeleccionado) {
        obtenerServiciosPorTipoYGrupo(tipoSeleccionado, value);
    } else {
        console.warn("Tipo no seleccionado aún");
    }
    };

    return (
        <>
            <Drawer
                title="Editar Tarifa"
                width={350}
                onClose={onClose}
                open={open}
                footer={
                    <div style={{ textAlign: "right" }}>
                        <Button onClick={onClose} style={{ marginRight: 8 }}>Cancelar</Button>
                        <Button onClick={guardarTarifas} style={{ marginRight: 8 }}>Guardar</Button>
                    </div>
                }
            >
                <Form form={form} layout="vertical">
                    
                    <Form.Item
                        label="Cliente"
                        name="cliente"
                        rules={[{ required: true, message: "El nombre del cliente es requerido" }]}
                    >
                        <Select placeholder="Seleccione cliente">
                        {cliente.map(item => (
                            <Select.Option key={item.id} value={item.id}>
                            {item.cliente}
                            </Select.Option>
                        ))}
                        </Select>
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
                        <Select placeholder="Seleccione el Grupo de Servicio" value={grupoServiciosId} onChange={handleGrupoChange}>
                            {grupo.map(item => (
                                <Select.Option key={item.id} value={item.id} label={item.grupo}>
                                    {item.grupo}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Servicio"
                        name="servicio"
                        rules={[{ required: true, message: "El servicio es requerido" }]}
                    >
                        <Select placeholder="Seleccione un servicio">
                        {servicio.map(item => (
                            <Select.Option key={item.id} value={item.id}>
                            {item.servicio}
                            </Select.Option>
                        ))}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                        label="Tarifa"
                        name="tarifa"
                        rules={[{ required: true, message: "La tarifa es requerida" }]}
                    >
                        <InputNumber style={{ width: '100%' }} />
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

export default EditarTarifas;