import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Container, Typography, Box, Alert } from "@mui/material"; 
import { loginUser } from "../../servicios/cuentaservicios";
import { apiURL } from "../UrlBackend";
import NavBarCl from "../index/NavBarCl";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    const accionLogin = async (e) => {
        e.preventDefault();
        console.log("Botón presionado");
        console.log("Enviando:", { username, password });
        try {
            const respuetaUsuario = await loginUser(username, password);
            
            localStorage.setItem('token', respuetaUsuario.access);
            localStorage.setItem('access_token', respuetaUsuario.access);
            localStorage.setItem('refresh_token', respuetaUsuario.refresh);

            setTimeout(() => {
                navigate('/Seleccion', { replace: true });
            }, 2000);

            if (respuetaUsuario.access) {
                localStorage.setItem('token', respuetaUsuario.access);
                localStorage.setItem("nombreUsuario", username);
                localStorage.setItem("idUsuario", userId)
                navigate('/');
            } else {
                setError("Usuario o contraseña incorrectos");
            }
        } catch (error) {
            console.error("Error al iniciar sesión", error);
            setError("Error al iniciar sesión");
        }
    };

    return (
        <>
        <NavBarCl />
        <Box
            sx={{
                backgroundImage: 'url(/assets/background_6.jpg)',
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
                        Iniciar Sesión
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}

                    <Box component="form" onSubmit={accionLogin} sx={{ mt: 1 }}>
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
                            Iniciar Sesión
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
        </>
    );
};

export default Login;
