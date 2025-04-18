import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Container, Typography, Box, Alert } from "@mui/material"; 
import { registro } from "../../servicios/cuentaservicios";
import apiURL from "../UrlBackend";
import axios from "axios";
import NavBarCl from "../index/NavBarCl";

const Registro = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const accionRegistro = async (e) => {
        e.preventDefault();
        console.log("Botón presionado");
        console.log("Enviando:", { username, password });
        try {
            const respuestaUsuario = await registro(username, password);
            setSuccessMessage('Usuario creado con éxito');
            setTimeout(() => {
                navigate('/Login', { replace: true });
            }, 2000);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.username) {
                setError(error.response.data.username[0]);
            } else {
                setError("Error al registrar usuario");
            }
        }
    };
    
    const registro = async (username, password) => {
        try {
            const response = await axios.post(
                `${apiURL}api/registro/`,
                { username, password }, // Datos en el cuerpo de la solicitud
                {
                    headers: {
                        "Content-Type": "application/json", // Encabezado Content-Type
                    },
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    };

    return (
        <>
        <NavBarCl />
        <Box
            sx={{
                backgroundImage: 'url(/assets/background_11.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        padding: 4,
                        borderRadius: 2,
                        boxShadow: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src="logo_bevi.png"
                        alt="Logo"
                        style={{ width: 240, marginBottom: 20 }}
                    />
                    <Typography component="h1" variant="h5">
                        Registro de Usuario
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}

                    <Box component="form" onSubmit={accionRegistro} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Usuario"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                backgroundColor: '#10295e', 
                                color: '#fff',              
                                marginTop: 2,
                                '&:hover': {
                                backgroundColor: '#2C98CB', 
                                
                                }
                            }}
                        >
                            Registrarse
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
        </>
    );
};

export default Registro;
