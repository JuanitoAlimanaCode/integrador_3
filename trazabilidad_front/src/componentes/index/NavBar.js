import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../servicios/cuentaservicios";
import { AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Menu, 
  MenuItem, 
  IconButton, 
  Drawer, 
  Avatar,
  Divider } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const NavBar = () => {
  const navigate = useNavigate();
  const [centro, setCentro] = useState("");
  const username = localStorage.getItem("nombreUsuario");
  const avatarUrl = localStorage.getItem("avatarUrl");

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    
  };

  useEffect(() => {
    const nombreCentro = localStorage.getItem("centroSeleccionado");
    if (nombreCentro) {
      setCentro(nombreCentro);
    }
  }, []); 

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#10295e", mt: -1 }}>
        <Toolbar>
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              fontFamily="Open Sans, sans-serif"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <img
            src="/assets/logo_blanco_x.png"
            alt="Logo"
            style={{ width: 120, marginRight: 10 }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Link to="/" style={{ textDecoration: "none", fontFamily: "Open Sans, sans-serif", color: "inherit" }}>
              | Trazapp -
            </Link>
            {centro && (
              <span style={{ fontFamily: "Open Sans, sans-serif", fontWeight: "bold" }}>
                {centro}
              </span>
            )}
          </Typography>
          {localStorage.getItem("token") && (
          <>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button color="white" variant="text" component={NavLink} to="/menu">Menú</Button>
              <Button color="white" variant="text" component={NavLink} to="/agregar">Agregar Servicio</Button>
              <Button color="white" variant="text" component={NavLink} to="/seguimiento">Trazabilidad</Button>
              {/* Botón que abre el submenú */}
              <Button
                color="white"
                variant="text"
                onClick={handleClick}
              >
                Parámetros
              </Button>
                {/* Submenú */}
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem component={NavLink} to="/centros_log" onClick={handleClose}>Centros Logísticos</MenuItem>
                  <Divider />
                  <MenuItem component={NavLink} to="/grupoclientes" onClick={handleClose}>Grupo Clientes</MenuItem>
                  <MenuItem component={NavLink} to="/clientes" onClick={handleClose}>Clientes</MenuItem>
                  <Divider />
                  <MenuItem component={NavLink} to="/ubicacion" onClick={handleClose}>Ubicaciones</MenuItem>
                  <Divider />
                  <MenuItem component={NavLink} to="/tiposervicios" onClick={handleClose}>Tipo de Servicio</MenuItem>
                  <MenuItem component={NavLink} to="/gruposervicios" onClick={handleClose}>Grupo de Servicio</MenuItem>
                  <MenuItem component={NavLink} to="/servicios" onClick={handleClose}>Servicios</MenuItem>
                  <MenuItem component={NavLink} to="/tarifas" onClick={handleClose}>Tarifas</MenuItem>
                </Menu>
                <Button
                  color="white"
                  variant="text"
                  onClick={handleClick2}
                  startIcon={
                    avatarUrl ? (
                      <Avatar
                        src={avatarUrl}
                        alt={username}
                        sx={{ width: 32, height: 32 }}
                      />
                    ) : (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontSize: 14 }}>
                        {username?.[0] || 'U'}
                      </Avatar>
                    )
                  }
                >
                  <span style={{ fontFamily: "Open Sans, sans-serif", fontWeight: "bold" }}>
                    {username}
                  </span>
                </Button>
                <Menu anchorEl={anchorEl2} open={open2} onClose={handleClose2}>
                  <MenuItem component={NavLink} to="/Perfil" onClick={handleClose2}>Perfil</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                </Menu>
            </Box>
          </>
        )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
      >
        <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
          <MenuItem component={NavLink} to="/menu">Menú</MenuItem>
          <MenuItem component={NavLink} to="/agregar_servicio">Agregar Servicio</MenuItem>
          <MenuItem component={NavLink} to="/trazabilidad">Trazabilidad</MenuItem>
          {/* Agrega el resto de opciones aquí */}
          <Divider />
          <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;
