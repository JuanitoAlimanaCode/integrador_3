import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { loginUser, logoutUser, registro } from "../../servicios/cuentaservicios";
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Divider } from "@mui/material";


const NavBar = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = async () => {
    
    navigate("/Login");
  }

  const handleRegister = async () => {
    
    navigate("/Registro");
  }

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#10295e", mt: -1  }}>
        <Toolbar>
          <img
            src="/assets/logo_blanco_x.png"
            alt="Logo"
            style={{ width: 120, marginRight: 10 }}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              |  Trazapp
            </Link>
          </Typography>
          {localStorage.getItem("token") ? (
            <>
              <Button onClick={handleLogout} color="white" variant="text">Cerrar sesión</Button>
            </>
          ) : (
            <>
              <Button onClick={handleLogin} color="primary" variant="contained">Iniciar sesión</Button>
              <Button onClick={handleRegister} color="#10295E" variant="text">Registrarse</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
