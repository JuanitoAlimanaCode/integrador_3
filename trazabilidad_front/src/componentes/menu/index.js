import React from "react";
import NavBar from "../index/NavBar";
import { Container, Button, Grid, Box, Typography } from "@mui/material";
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import RouteIcon from '@mui/icons-material/Route';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  const agregarServicio = (nombrecl) => {
    navigate("/agregar");
  };

  const trazabilidad = (nombrecl) => {
    navigate("/seguimiento");
  };

  const cambiarCentro = (nombrecl) => {
    navigate("/seleccion");
  };

  return (
    <>
      <NavBar />
      <Box 
                  sx={{
                      backgroundImage: 'url(/assets/background.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      minHeight: '90vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                  }}
              >
            
      <Container sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ fontFamily: "Oswald", color: "#10295E", mb: 4 }}
        >
          Menú Principal
        </Typography>
        <Grid container spacing={2} justifyContent="center">
        <Grid item>
            <Button
              onClick={agregarServicio}
              variant="contained"
              sx={{
                flexDirection: "column",
                padding: 2,
                backgroundColor: "#10295E",
                fontFamily: "Open Sans",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                  color: "#10295E", // un tono más oscuro para hover
                },
              }}
            >
              <AddHomeWorkIcon sx={{ fontSize: 120, mb: 1 }} />
              <Typography variant="button">Agregar Servicio</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={trazabilidad}
              variant="contained"
              sx={{
                flexDirection: "column",
                padding: 2,
                backgroundColor: "#2C98CB",
                fontFamily: "Open sans",
                color: "#10295E",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                  color: "#10295E", 
                },
              }}
            >
              <RouteIcon sx={{ fontSize: 120, mb: 1 }} />
              <Typography variant="button">Trazabilidad</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={cambiarCentro}
              variant="contained"
              sx={{
                flexDirection: "column",
                padding: 2,
                flexDirection: "column",
                padding: 2,
                backgroundColor: "#FD5653",
                color: "#ffffff",
                fontFamily: "Open sans",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                  color: "#10295E", // un tono más oscuro para hover
                },
              }}
            >
              <WarehouseIcon sx={{ fontSize: 120, mb: 1 }} />
              <Typography variant="button">Cambiar Centro</Typography>
            </Button>
          </Grid>
        </Grid>
      </Container>
      </Box>
    </>
  );
};

export default Menu;