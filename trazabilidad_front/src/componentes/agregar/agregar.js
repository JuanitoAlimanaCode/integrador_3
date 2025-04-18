import react, { useState, useEffect } from "react";
import NavBar from "../index/NavBar";
import { getClientes, getUbicacionPorTipoYGrupo, getTipoServicios, getGrupoServiciosPorTipo, getServiciosPorTipoYGrupo  } from "../../servicios/trazappservicios";
import { Form, Select } from "antd";
import {
    Box,
    Container,
    Typography,
    TextField,
    InputLabel,
    InputNumber,   
    Button,
    MenuItem,
    Alert,
    Snackbar,
    CircularProgress,
    Card,
    message } from "@mui/material";
import axios from "axios";
import apiURL from "../UrlBackend";
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";

const Agregar = () => {

    const [formulario] = Form.useForm();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [resultadosBusqueda, setResultadosBusqueda] = useState(null);
    const [errorBusqueda, setErrorBusqueda] = useState('');

    const [cliente, setCliente] = useState([]);
    const [ubicacion, setUbicacion] = useState([]);
    const [tipo, setTipo] = useState([]);
    const [grupo, setGrupo] = useState([]);
    const [servicio, setServicio] = useState([]);
    const [tarifas, setTarifas] = useState([]);

    const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

    const [previewFoto, setPreviewFoto] = useState("/assets/auto.jpg");
    const imageUrl = previewFoto; // Modificación aquí

    const [fechaActual, setFechaActual] = useState('');
    const [horaActual, setHoraActual] = useState('');

    const [ubusuario, setUbUsuario] = useState({ latitud: '', longitud: '' });
    const [cargandoUbicacion, setCargandoUbicacion] = useState(true);
    const [errorUbicacion, setErrorUbicacion] = useState('');

    const [centroLogistico, setCentroLogistico] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');

    const [agregar, setAgregar] = useState({
        VIN: '',
        placa: '',
        foto: null,
        cliente: '',
        ubicacion: '',
        tipo: '',
        grupo: null,
        servicio: null,
        tarifa: 0,
        latitud: '',
        longitud: '',
        centrolog: '',
        usuario: null,
    });

    const buscarPorVIN = async () => {
        setErrorBusqueda('');
        setResultadosBusqueda(null);
    
        if (agregar.VIN && agregar.VIN.length === 17) {
          const apiUrl = `https://script.google.com/macros/s/AKfycbwJSnYOoqltX2jidDWgpt1qhJbxGVxwrr6LgNeSkDxOfDpfHG8f81eaY-9IBVHhT0U1Lw/exec?vin=${agregar.VIN}`;
    
          try {
            const response = await axios.get(apiUrl);
            setResultadosBusqueda(response.data);
            if (response.data && response.data.cliente) {
                const clienteEncontrado = cliente.find((c) => c.cliente === response.data.cliente);
                console.log('Cliente encontrado:', clienteEncontrado);
                if (clienteEncontrado) {
                    setAgregar((prevAgregar) => {
                        const clienteId = clienteEncontrado ? clienteEncontrado.id : ''; // Valor seguro por si acaso
                        const nuevoAgregar = {
                          ...prevAgregar,
                          cliente: clienteId,
                        };
                        console.log('Estado agregar dentro de setAgregar:', nuevoAgregar);
                        return nuevoAgregar; // ¡Asegúrate de incluir el 'return'!
                      });
                } else {
                  setErrorBusqueda(`Cliente "${response.data.cliente}" no encontrado en la lista.`);
                  setAgregar((prevAgregar) => ({ ...prevAgregar, cliente: '' }));
                }
              } else {
                setErrorBusqueda("La respuesta de la búsqueda no contiene información del cliente.");
                setAgregar((prevAgregar) => ({ ...prevAgregar, cliente: '' }));
              }

          } catch (error) {
            console.error("Error al buscar por VIN:", error);
            setErrorBusqueda("Error al realizar la búsqueda. Por favor, inténtalo de nuevo.");
            setAgregar((prevAgregar) => ({ ...prevAgregar, cliente: '' }));
          }
        } else {
          setErrorBusqueda("Por favor, ingresa un VIN válido de 17 caracteres.");
          setAgregar((prevAgregar) => ({ ...prevAgregar, cliente: '' }));
        }
      };

    useEffect(() => {
    const obtenerClientes = async () => {
        try {
            const response = await getClientes();
            setCliente(response);
        } catch (error) {
            console.error("Error al obtener cliente:", error);
        }
    };
    obtenerClientes();
    }, []);

      useEffect(() => {
    const obtenerTipo = async () => {
        try {
            const response = await getTipoServicios();
            console.log("Respuesta de getTipoServicios:", response);
            setTipo(response);
        } catch (error) {
            console.error("Error al obtener el tipo de servicio:", error);
        }
    };
    obtenerTipo();
    }, []);

    const handleTipoChange = (value) => {
        setTipoSeleccionado(value);
        console.log("Tipo seleccionado:", value);
        obtenerGrupoServiciosPorTipo(value);
        formulario.setFieldsValue({ grupo: undefined, servicio: undefined });
        setServicio([]);
    };

    const obtenerGrupoServiciosPorTipo = async (tipoId) => {
        try {
            const response = await getGrupoServiciosPorTipo(tipoId);
            setGrupo(response);
        } catch (error) {
            console.error("Error al obtener grupo por tipo:", error);
        }
        };

    const handleGrupoChange = (value) => {
        console.log("Tipo seleccionado:", tipoSeleccionado, "Grupo seleccionado:", value);
        if (tipoSeleccionado) {
            obtenerServiciosPorTipoYGrupo(tipoSeleccionado, value);
        } else {
            console.warn("Tipo no seleccionado aún");
        }
        };        

    const handleUbicacionChange = (value) => {
        console.log("Tipo seleccionado:", tipoSeleccionado, "Grupo seleccionado:", value);
        if (tipoSeleccionado) {
            obtenerUbicacionPorTipoYGrupo(tipoSeleccionado, value);
        } else {
            console.warn("Tipo no seleccionado aún");
        }
        };  

    const obtenerServiciosPorTipoYGrupo = async (tipoId, grupoId) => {
        try {
        const response = await getServiciosPorTipoYGrupo(tipoId, grupoId);
        console.log("Datos recibidos para servicio:", response);
        setServicio(response || []);
        } catch (error) {
        console.error("Error al obtener servicios por tipo y grupo:", error);
        }
    };          

    const obtenerUbicacionPorTipoYGrupo = async (tipoId, grupoId) => {
        try {
        const response = await getUbicacionPorTipoYGrupo(tipoId, grupoId);
        console.log("Datos recibidos para ubicacion:", response);
        setUbicacion(response || []);
        } catch (error) {
        console.error("Error al obtener ubicaciones por tipo y grupo:", error);
        }
    };   

    const cargarFoto = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAgregar((prev) => ({ ...prev, foto: file }));
            const fotoPreview = URL.createObjectURL(file);
            setPreviewFoto(fotoPreview);
        }
    }

    console.log("Estado de grupo:", grupo);

    useEffect(() => {
        const actualizarHora = () => {
          const now = new Date();
          const fecha = now.toLocaleDateString();
          const hora = now.toLocaleTimeString(); 
          setFechaActual(fecha);
          setHoraActual(hora);
        };
        actualizarHora();
        const intervalId = setInterval(actualizarHora, 1000);
        return () => clearInterval(intervalId);
      }, []); 
    
    useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            setUbUsuario({
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
            });
            setAgregar((prevAgregar) => ({
            ...prevAgregar,
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
            }));
            setCargandoUbicacion(false);
        },
        (error) => {
            setErrorUbicacion('Error al obtener la ubicación: ' + error.message);
            setCargandoUbicacion(false);
        }
        );
    } else {
        setErrorUbicacion('La geolocalización no es compatible con este navegador.');
        setCargandoUbicacion(false);
    }
    }, []);

    useEffect(() => {
        const centro = localStorage.getItem("centroSeleccionado");
        if (centro) {
          setCentroLogistico(centro);
          setAgregar((prevAgregar) => ({
            ...prevAgregar,
            centrolog: centro,
          }));
        }
      }, [setAgregar]);

      useEffect(() => {
        const nombre = localStorage.getItem("nombreUsuario");
        if (nombre) {
            setNombreUsuario(nombre);  // Actualiza el estado
            setAgregar((prevAgregar) => ({
                ...prevAgregar,
                usuario: nombre,  // Asigna el nombre a agregar.usuario
            }));
        }
    }, []);

    const guardarCambios = async (e) => {
        e.preventDefault();
        
        console.log("Estado agregar al guardar:", agregar);
        try {
            const nombreUsuario = localStorage.getItem('nombreUsuario');
            const formData = new FormData();
            formData.append('VIN', agregar.VIN);
            formData.append('placa', agregar.placa);
            formData.append('cliente', agregar.cliente);
            formData.append('ubicacion', agregar.ubicacion);
            formData.append('tipo', agregar.tipo);
            formData.append('grupo', agregar.grupo);
            formData.append('servicio', agregar.servicio);
            formData.append('tarifa', agregar.tarifa);
            formData.append('latitud', agregar.latitud);
            formData.append('longitud', agregar.longitud);
            formData.append('centrolog', agregar.centrolog);
            formData.append('usuario', nombreUsuario);  

            if (agregar.foto) {
                formData.append('foto', agregar.foto);
            }
            console.log(formData);
            const response = await axios.put(`${apiURL}api/agregar/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log(response.data);
            setMensaje("Servicio agregado con éxito");
            setError(''); 
            
            setAgregar((prevState) => ({
                ...prevState,
                VIN: '',
                placa: '',
                cliente: '',
                ubicacion: null,
                tipo: null,
                grupo: null,
                servicio: null,
                tarifa: 0,
                foto: null,
              }));
              setOpenSnackbar(true);
        } catch (error) {
            console.error("Error al guardar cambios:", error);
            setError("Error al guardar cambios. Por favor, inténtalo de nuevo."); 
            setMensaje(''); 
        }
    };

    useEffect(() => {
        const obtenerTarifas = async () => {
            try {
                const response = await axios.get(`${apiURL}api/tarifas/`, { // <--- PASA UN OBJETO DE CONFIGURACIÓN
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // <--- INCLUYE EL TOKEN AQUÍ
                    }
                });
                setTarifas(response.data);
                console.log("Tarifas cargadas:", response.data);
    
                if (agregar.cliente && agregar.tipo && agregar.grupo && agregar.servicio) {
                    console.log("Buscando tarifa DESPUÉS de cargar:", {
                        cliente: agregar.cliente,
                        tipo: agregar.tipo,
                        grupo: agregar.grupo,
                        servicio: agregar.servicio
                    });
                    const nuevaTarifa = buscarTarifa(
                        agregar.cliente,
                        agregar.tipo,
                        agregar.grupo,
                        agregar.servicio
                    );
                    setAgregar((prevAgregar) => ({ ...prevAgregar, tarifa: nuevaTarifa }));
                }
    
            } catch (error) {
                console.error("Error al obtener tarifas:", error);
            }
        };
        obtenerTarifas();
    }, [agregar.cliente, agregar.tipo, agregar.grupo, agregar.servicio]);

    const buscarTarifa = (clienteId, tipoId, grupoId, servicioId) => {
        console.log("Buscar tarifa llamado con:", { clienteId, tipoId, grupoId, servicioId });
        console.log("Estado de tarifas al buscar:", tarifas);

        if (tarifas && cliente && tipo && grupo && servicio) {
            const tarifaEncontrada = tarifas.find(
                (tarifaItem) => {
                    console.log("Comparando tarifaItem:", {
                        clienteIdItem: tarifaItem.cliente?.id,
                        tipoIdItem: tarifaItem.tipo?.id,
                        grupoIdItem: tarifaItem.grupo?.id,
                        servicioIdItem: tarifaItem.servicio?.id,
                        tarifaValueItem: tarifaItem?.tarifa
                    });
                    return (
                        Number(tarifaItem.cliente?.id) === Number(clienteId) &&
                        Number(tarifaItem.tipo?.id) === Number(tipoId) &&
                        Number(tarifaItem.grupo?.id) === Number(grupoId) &&
                        Number(tarifaItem.servicio?.id) === Number(servicioId)
                    );
                }
            );
            console.log("Tarifa encontrada:", tarifaEncontrada);
            return tarifaEncontrada ? tarifaEncontrada.tarifa : 0;
        }
        return 0;
    };

    const refrescarPagina = () => {
        formulario.resetFields(['cliente', 'ubicacion', 'tipo', 'grupo', 'servicio']);
        setAgregar({
            VIN: '',
            placa: '',
            cliente: null,
            ubicacion: null,
            tipo: null,
            grupo: null,
            servicio: null,
            foto: null,
            tarifa: 0,
        });
    };

    const cancelar = () => {
        refrescarPagina();
        navigate("/menu");
    }  

    return (
        <>
            <NavBar />
            <Box
                sx={{
                    backgroundImage: 'url(/assets/background_4.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '90vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mb={10}>
                    <Box>
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{
                                color: "#10295E",
                                fontWeight: "regular",
                                mt: 1,
                                mb: 1,
                                fontFamily: "Oswald, sans-serif"
                            }}
                        >
                            Agregar Servicio
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection="row" gap={5} sx={{bgcolor: "background.paper", padding: 2}}>
                        <Box display="flex" flexDirection="column" width={"100%"}>
                            <Box display="flex" flexDirection="row" gap={2} alignItems={"center"}> 
                                <TextField
                                    label="VIN/Serial:"
                                    name="VIN"
                                    margin="normal"
                                    width="100%"
                                    rules={[{ length: 17, message: "El vin debe contener 17 caracteres" }]}
                                    onChange={(e) => setAgregar({...agregar, VIN: e.target.value})}
                                    value={agregar.VIN}
                                />
                                <Button 
                                startIcon={<SearchIcon />} 
                                variant="contained" 
                                onClick={buscarPorVIN}
                                sx={{
                                    backgroundColor: '#10295e', 
                                    color: '#fff',              
                                    marginTop: 2,
                                    width: '50px',
                                    '&:hover': {
                                    backgroundColor: '#2C98CB', 
                                    }
                                }}>
                                </Button>
                            </Box>
                            {errorBusqueda && <p style={{ color: 'red' }}>{errorBusqueda}</p>}

                            {resultadosBusqueda && (
                                <Card sx={{ margin: 1, padding: 1, fontFamily: "Open Sans, sans-serif", bgcolor:"#F2F2F2" }}>
                                  <Typography variant="h6" component="div" color="#10295E">
                                    {resultadosBusqueda.cliente}
                                  </Typography>
                                  <Typography variant="body2" color="#10295E">
                                    Agrupación: {resultadosBusqueda.agrupacion} - {resultadosBusqueda.subgrupo}
                                  </Typography>
                                  <Typography variant="body2">
                                    Marca: {resultadosBusqueda.marca} - {resultadosBusqueda.version}
                                  </Typography>
                                </Card>
                            )}
                            <TextField
                                label="Placa:"
                                name="placa"
                                margin="normal"
                                width="150px"
                                onChange={(e) => setAgregar({...agregar, placa: e.target.value})}
                                value={agregar.placa}
                            />
                            <label htmlFor="foto-upload">
                                <Button variant="text" component="span">
                                    Cargar Foto
                                </Button>
                                <input
                                    id="foto-upload"
                                    type="file"
                                    name="foto"
                                    accept="image/*"
                                    onChange={cargarFoto}
                                    style={{ display: "none" }}
                                />
                            </label>
                            <img
                                src={imageUrl}
                                alt="Foto"
                                style={{
                                    width: "250px",
                                    height: "150px",
                                    borderRadius: "5%",
                                    marginBottom: "16px",
                                    border: "2px solid #10295E"
                                }}
                            />
                        </Box>
                        <Box display="flex" flexDirection="column" width={"100%"}>
                            <Form.Item label="Cliente:" name="cliente">
                                <Select
                                        placeholder="Seleccione un cliente"
                                        value={Number(agregar.cliente)}
                                        onChange={(value) => setAgregar({...agregar, cliente: value})}
                                        style={{ width: 250, height: 40 }}
                                    >
                                        {cliente.map((Item) => (
                                            <Select.Option key={Item.id} value={Number(Item.id)}>
                                                {Item.cliente}
                                            </Select.Option>
                                        ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Tipo de Servicio:" name="tipo">
                                <Select
                                    placeholder="Seleccione un tipo de servicio"
                                    onChange={(value) => {
                                        setAgregar({...agregar, tipo: value}); 
                                        handleTipoChange(value);             
                                    }}
                                    value={agregar.tipo}
                                    style={{ width: 250, height: 40 }}
                                >
                                    {tipo.map((Item) => (
                                        <Select.Option key={Item.id} value={Item.id}>
                                            {Item.nombre}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Grupo Servicio:" name="grupo">
                                <Select
                                    placeholder="Seleccione un grupo"
                                    onChange={(value) => {
                                        setAgregar({...agregar, grupo: value}); 
                                        handleGrupoChange(value);
                                        handleUbicacionChange(value);             
                                    }}
                                    value={agregar.grupo}
                                    style={{ width: 250, height: 40 }}
                                >
                                    {grupo.map((grupoItem) => (
                                        <Select.Option key={grupoItem.id} value={grupoItem.id}>
                                            {grupoItem.grupo}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Servicio:" name="servicio">
                                <Select
                                    placeholder="Seleccione un servicio"
                                    onChange={(value) => setAgregar({...agregar, servicio: value})}
                                    value={agregar.servicio}
                                    style={{ width: 250, height: 40 }}
                                >
                                    {servicio.map((Item) => (
                                        <Select.Option key={Item.id} value={Item.id}>
                                            {Item.servicio}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Ubicación:" name="ubicacion">
                                <Select
                                    placeholder="Seleccione una ubicación"
                                    onChange={(value) => setAgregar({...agregar, ubicacion: value})}
                                    value={agregar.ubicacion}
                                    style={{ width: 250, height: 40 }}
                                >
                                    {ubicacion.map((Item) => (
                                        <Select.Option key={Item.id} value={Item.id}>
                                            {Item.ubicacion}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <TextField
                                label="Tarifa:"
                                name="tarifa"
                                margin="normal"
                                width="150px"
                                value={agregar.tarifa}
                                disabled={true}
                            />
                        </Box>
                        <Box display="flex" flexDirection="column" width={"100%"}>
                            <Box display="flex" flexDirection="row" width={"100%"} gap={2}>
                                <TextField
                                    label="Fecha y Hora:"
                                    name="fecha"
                                    margin="normal"
                                    width="75%"
                                    value={fechaActual}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    label="Hora:"
                                    name="fecha"
                                    margin="normal"
                                    width="75%"
                                    value={horaActual}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Box>
                            <Box display="flex" flexDirection="row" width={"100%"} gap={2}>
                                <TextField
                                    label="Latitud:"
                                    name="latitud"
                                    margin="normal"
                                    width="75%"
                                    value={ubusuario.latitud}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    label="Longitud:"
                                    name="longitud"
                                    margin="normal"
                                    width="75%"
                                    value={ubusuario.longitud}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Box>
                            <Box display="flex" flexDirection="row" width={"100%"} gap={2}>    
                                <TextField
                                    label="Centro Logístico:"
                                    name="centrolog"
                                    margin="normal"
                                    width="75%"
                                    value={centroLogistico}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    label="Usuario:"
                                    name="usuario"
                                    margin="normal"
                                    width="75%"
                                    value={nombreUsuario}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Box>
                            <Box display="flex" flexDirection="row" width={"100%"} gap={1}>    
                                <Button type="submit" onClick={guardarCambios} startIcon={<SaveIcon />}
                                sx={{
                                    backgroundColor: '#10295e', 
                                    color: '#fff',              
                                    marginTop: 2,
                                    width: '60%',
                                    '&:hover': {
                                    backgroundColor: '#2C98CB', 
                                    }
                                }}>
                                    Guardar
                                </Button>
                                <Button type="submit" onClick={refrescarPagina} startIcon={<RefreshIcon />}
                                sx={{
                                    backgroundColor: '#2C98CB', 
                                    color: '#10295e',              
                                    marginTop: 2,
                                    width: '20%',
                                    '&:hover': {
                                    backgroundColor: '#f2f2f2', 
                                    }
                                }}>
                                </Button>   
                                <Button type="submit" onClick={cancelar} startIcon={<CancelIcon />}
                                sx={{
                                    backgroundColor: '#FD5653', 
                                    color: '#ffffff',              
                                    marginTop: 2,
                                    width: '20%',
                                    '&:hover': {
                                    backgroundColor: '#2C98CB', 
                                    }
                                }}>
                                </Button> 
                            </Box>
                        </Box>    
                    </Box>
                </Box>
            </Box>
            <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
            <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                Operación creada correctamente
            </MuiAlert>
            </Snackbar>
        </>
    )
}

export default Agregar;