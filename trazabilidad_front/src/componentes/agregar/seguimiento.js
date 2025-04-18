import React, { useState, useEffect, useRef } from "react";
import NavBar from "../index/NavBar";
import axios from "axios";
import { getAgregarPorVIN } from "../../servicios/trazappservicios";
import apiURL from "../UrlBackend";
import { TextField, Box, Container, Typography, Button, Card } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Seguimiento = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [resultadosBusqueda, setResultadosBusqueda] = useState(null);
    const [errorBusqueda, setErrorBusqueda] = useState('');
    const [resultadosTabla, setResultadosTabla] = useState(null);
    const [center, setCenter] = useState([0, 0]);
    const mapRef = useRef(null);

    const thStyle = {
        padding: '8px',
        textAlign: 'left',
        fontWeight: 'bold',
        border: '1px solid #ddd'
    };
    
    const tdStyle = {
        padding: '8px',
        textAlign: 'left',
        border: '1px solid #ddd'
    };

    const buscarPorVIN = async () => {

        setErrorBusqueda('');
        setResultadosBusqueda(null);
        setResultadosTabla(null); // <-- si usas otra variable para la tabla
      
        if (searchTerm && searchTerm.length === 17) {
          // URL del Apps Script
          const apiGoogle = `https://script.google.com/macros/s/AKfycbwJSnYOoqltX2jidDWgpt1qhJbxGVxwrr6LgNeSkDxOfDpfHG8f81eaY-9IBVHhT0U1Lw/exec?vin=${searchTerm}`;
      
          try {
            // 🔄 Ambas peticiones al mismo tiempo
            const [resGoogle, resDjango] = await Promise.all([
              axios.get(apiGoogle),
              getAgregarPorVIN(searchTerm)
            ]);
      
            // Card con Google
            setResultadosBusqueda(resGoogle.data);
      
            // Tabla con Django
            setResultadosTabla(resDjango); 
            console.log("🖼️ Resultados desde Django:", resDjango);
          } catch (error) {
            console.error("Error al buscar por VIN:", error);
            setErrorBusqueda("Error al realizar la búsqueda. Por favor, inténtalo de nuevo.");
          }
        } else {
          setErrorBusqueda("Por favor, ingresa un VIN válido de 17 caracteres.");
        }
      };

    const calcularCentro = (data) => {
        const bounds = new LatLngBounds();
        data.forEach(item => {
            if (item.latitud && item.longitud) {
                bounds.extend([item.latitud, item.longitud]);
            }
        });
        return bounds.getCenter(); // Calcula el centro de todos los puntos
    };

    useEffect(() => {
        if (resultadosTabla && resultadosTabla.length > 0) {
            const nuevoCentro = calcularCentro(resultadosTabla); 
            setCenter([nuevoCentro.latitud, nuevoCentro.longitud]); 
        }
    }, [resultadosTabla]);

    const AjustarVista = ({ marcadores }) => {
        const map = useMap();
        const boundsRef = useRef(null);
    
        useEffect(() => {
            if (!marcadores || marcadores.length === 0) {
                return; // No hacer nada si no hay marcadores
            }
    
            const puntosValidos = marcadores
                .filter(m => m.latitud && m.longitud)
                .map(m => [parseFloat(m.latitud), parseFloat(m.longitud)]);
    
            if (puntosValidos.length > 0) {
                try {
                    boundsRef.current = L.latLngBounds(puntosValidos);
                    map.fitBounds(boundsRef.current, { padding: [50, 50] });
                } catch (error) {
                    console.error("Error al calcular o ajustar los límites:", error);
                }
            } else {
                // Opcional: Si no hay puntos válidos, podrías centrar el mapa en una ubicación por defecto
                // map.setView([/* latitud por defecto */, /* longitud por defecto */], 13);
                console.warn("No se encontraron coordenadas válidas para ajustar la vista del mapa.");
            }
        }, [marcadores, map]);
    
        return null;
    };

    useEffect(() => {
        console.log("useEffect se ejecutó con resultadosTabla:", resultadosTabla);
        console.log("mapRef.current:", mapRef.current);

        if (resultadosTabla && resultadosTabla.length > 0 && mapRef.current) {
            const map = mapRef.current;
            const puntosValidos = resultadosTabla
                .filter(item => item.latitud && item.longitud)
                .map(item => [parseFloat(item.latitud), parseFloat(item.longitud)]);
    
            console.log("puntosValidos:", puntosValidos);

            if (puntosValidos.length > 0) {
                try {
                    const bounds = L.latLngBounds(puntosValidos);
                    map.fitBounds(bounds, { padding: [50, 50] });
                    console.log("Mapa ajustado a los límites:", bounds.getCenter(), map.getZoom());
                } catch (error) {
                    console.error("Error al ajustar los límites del mapa:", error);
                }
            } else {
                console.warn("No hay coordenadas válidas para centrar el mapa.");
            }
        } else if (!mapRef.current) {
            console.log("La referencia al mapa aún no está disponible.");
        } else if (!resultadosTabla || resultadosTabla.length === 0) {
            console.log("resultadosTabla está vacío o no definido.");
        }
    }, [resultadosTabla]);

    const refrescarPagina = () => {
        setSearchTerm('');
        setResultadosBusqueda(null);
        setErrorBusqueda('');
        setResultadosTabla(null);
        setCenter([4.6, -74.1]); // O tu centro inicial por defecto
        if (mapRef.current) {
            mapRef.current.setView([4.6, -74.1], 13); // O tu zoom inicial por defecto
        }
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
                <Container>
                <Typography
                    variant="h4"
                    align="center"
                    sx={{
                        color: '#10295E',
                        mt: 1,
                        mb: 1,
                        fontFamily: "Oswald, sans-serif"
                    }}
                    >
                    Trazabilidad
                    </Typography>
                    <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '80%', margin: '0 auto', gap: 5 }}>
                        <TextField
                        label="Ingrese VIN"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            width: '80%',
                            '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: '#10295E', // 
                            },
                            },
                            '& .MuiInputBase-input': {
                            fontFamily: 'Open Sans, sans-serif', 
                            },
                        }}
                        />                    
                        <Button
                        startIcon={<SearchIcon />}
                        onClick={buscarPorVIN}
                        variant="contained"
                        sx={{
                            width: '20%',
                            backgroundColor: "#10295E",
                            color: "#ffffff",
                            "&:hover": {
                            backgroundColor: "#ffffff",
                            color: "#10295E",
                            },
                        }}
                        >
                        Buscar VIN
                        </Button>
                    </Container>
                    <Box sx={{ display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center', mb: 2, margin: '0 auto', gap: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
                        {errorBusqueda && <p style={{ color: 'red' }}>{errorBusqueda}</p>}

                        {resultadosBusqueda && (
                            <Card sx={{ margin: 1, padding: 1, fontFamily: "Open Sans, sans-serif", bgcolor:"#F2F2F2", width: '150vh' }}>
                            <Typography variant="h7" component="div" color="#10295E">
                                Cliente: {resultadosBusqueda.cliente}
                            </Typography>
                            <Typography variant="body2" color="#10295E">
                                Agrupación: {resultadosBusqueda.agrupacion}
                            </Typography>
                            <Typography variant="body2" color="#10295E">
                                Subgrupo: {resultadosBusqueda.subgrupo}
                            </Typography>
                            <Typography variant="body2" color="#10295E">
                                Marca: {resultadosBusqueda.marca}
                            </Typography>
                            <Typography variant="body2" color="#10295E">
                                Modelo: {resultadosBusqueda.version}
                            </Typography>
                            </Card>
                        )}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
                        {resultadosTabla && Array.isArray(resultadosTabla) && resultadosTabla.length > 0 && (
                        <Box sx={{ overflowX: 'auto', mt: 2 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Open Sans, sans-serif', fontSize: '14px' }}>
                            <thead style={{ backgroundColor: '#10295E', color: '#fff' }}>
                                <tr>
                                <th style={thStyle}>Foto</th>
                                <th style={thStyle}>Placa</th>
                                <th style={thStyle}>Tipo</th>
                                <th style={thStyle}>Grupo</th>
                                <th style={thStyle}>Servicio</th>
                                <th style={thStyle}>Ubicación</th>
                                <th style={thStyle}>Tarifa</th>
                                <th style={thStyle}>Fecha</th>
                                <th style={thStyle}>Hora</th>
                                <th style={thStyle}>Centro Logístico</th>
                                <th style={thStyle}>Usuario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultadosTabla.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #ccc' }}>
                                    <td style={tdStyle}>
                                    {item.foto ? (
                                        <img src={`${apiURL}${item.foto}`}  alt="foto" style={{ width: '60px', borderRadius: '5px' }} />
                                    ) : 'Sin foto'}
                                    </td>
                                    <td style={tdStyle}>{item.placa || '-'}</td>
                                    <td style={tdStyle}>{item.tipo || '-'}</td>
                                    <td style={tdStyle}>{item.grupo || '-'}</td>
                                    <td style={tdStyle}>{item.servicio || '-'}</td>
                                    <td style={tdStyle}>{item.ubicacion || '-'}</td>
                                    <td style={tdStyle}>{item.tarifa || '-'}</td>
                                    <td style={tdStyle}>{item.fecha || '-'}</td>
                                    <td style={tdStyle}>{item.hora || '-'}</td>
                                    <td style={tdStyle}>{item.centrolog || '-'}</td>
                                    <td style={tdStyle}>{item.usuario || '-'}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </Box>
                        )}

                        {/* Mapa con los puntos de latitud y longitud */}
                        <Box width={'200vh'} sx={{ mt: 2 }}>
                        <MapContainer center={[4.6, -74.1]} zoom={13} style={{ height: "400px", width: "100%" }} ref={mapRef}>
                            <AjustarVista marcadores={resultadosTabla || []} />
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {resultadosTabla && resultadosTabla.map((item, index) => (
                                item.latitud && item.longitud && (
                                    <Marker
                                        key={index}
                                        position={[item.latitud, item.longitud]}
                                        icon={new Icon({
                                            iconUrl: '/assets/pin.png',
                                            iconSize: [25, 25],
                                        })}
                                    >
                                        <Popup>
                                            <strong>{item.ubicacion}</strong>
                                        </Popup>
                                    </Marker>
                                )
                            ))}
                        </MapContainer>
                        </Box>

                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center',}} width={'100%'} gap={2}>
                        <Button type="submit" onClick={refrescarPagina} startIcon={<RefreshIcon />}
                                sx={{
                                    backgroundColor: '#2C98CB', 
                                    color: '#10295e',              
                                    marginTop: 2,
                                    marginBottom: 5,
                                    width: '100%',
                                    '&:hover': {
                                    backgroundColor: '#f2f2f2', 
                                    }
                                }}>Nueva Busqueda
                                </Button>   
                                <Button type="submit" onClick={cancelar} startIcon={<CancelIcon />}
                                sx={{
                                    backgroundColor: '#FD5653', 
                                    color: '#ffffff',              
                                    marginTop: 2,
                                    marginBottom: 5,
                                    width: '100%',
                                    '&:hover': {
                                    backgroundColor: '#2C98CB', 
                                    }
                                }}>Cancelar
                                </Button> 
                        </Box>
                    </Box>
                </Container>

            </Box>

        </>
    )
}

export default Seguimiento;