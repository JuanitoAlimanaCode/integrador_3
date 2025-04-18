import React, { useEffect, useState } from "react";
import NavBarCl from "./NavBarCl";
import { getCentrosLog } from "../../servicios/trazappservicios";
import { Box, Container, Grid, Typography, Card, CardContent , CardMedia, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Seleccion = () => {
  const imagenesDjango = ["bogota.jpeg", "yotoco.jpg", "santamarta.jpg"];
  const navigate = useNavigate();
  const [centrosLog, setCentrosLog] = useState([]);

  const obtenerCentrosLog = async () => {
    const response = await getCentrosLog();    
    setCentrosLog(response);
  }

  useEffect(() => {
    obtenerCentrosLog();
  }, []);

  const seleccionarCentro = (nombrecl) => {
    localStorage.setItem("centroSeleccionado", nombrecl);
    navigate("/menu");
  };

  return (
    <>
      <NavBarCl />
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
      
      <Container>
      <Typography
        variant="h4"
        align="center"
        sx={{ color: "#10295E", fontFamily: "Oswald", mt: 4, mb: 2 }}
      >
        Seleccione Centro Logístico
      </Typography>
        <Grid container spacing={2} justifyContent="center">

          {centrosLog.map((centroLog) => (
              
            <Grid item xs={12} sm={6} md={4} key={centroLog.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    imagenesDjango.includes(centroLog.imagen.split("/").pop())
                      ? `http://localhost:8000/static/assets/images/centros/${centroLog.imagen.split("/").pop()}`
                      : `http://localhost:8000${centroLog.imagen}`
                  }
                  alt={`Centro ${centroLog.nombrecl}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div"
                    sx={{ fontFamily: "Open Sans" }}>
                    {centroLog.nombrecl}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => seleccionarCentro(centroLog.nombrecl)}
                    sx={{ backgroundColor: "#10295E", fontFamily: "Open Sans" }}>
                    Seleccionar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
          ))}
        </Grid>
      </Container>
      </Box>
    </>
  );
};

export default Seleccion;