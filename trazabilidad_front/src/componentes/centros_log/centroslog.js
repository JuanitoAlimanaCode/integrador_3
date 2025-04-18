import React, { useEffect, useState } from "react";
import NavBar from "../index/NavBar";
import { getCentrosLog } from "../../servicios/trazappservicios";
import DrawerCentrosLog from "./crearDrawer";
import AddBusiness from '@mui/icons-material/AddBusiness';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditarCentrosLog from "./editarCL";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { deleteCentrosLog } from "../../servicios/trazappservicios";
import {
  Box,
  Button,
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Divider,
  IconButton,
  ListItemButton,
} from "@mui/material";

const Index = ({ centrologId, open, onClose, listaCentrosLog, onActualizar }) => {
  const imagenesDjango = ["bogota.jpeg", "yotoco.jpg", "santamarta.jpg"];
  const [centrosLog, setCentrosLog] = useState([]);
  const [drawerCrearCentro, setdrawerCrearCentro] = useState(false);
  const [drawerEditarCentro, setdrawerEditarCentro] = useState(false);
  const [centroLogIdSeleccionado, setCentroLogIdSeleccionado] = useState(null);
  const [centroSeleccionado, setCentroSeleccionado] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const editarCentrosLog = (centrosLog) => {
    setdrawerEditarCentro(true);
  }

  const obtenerCentrosLog = async () => {
    const response = await getCentrosLog();
    setCentrosLog(response);
  };

  useEffect(() => {
    obtenerCentrosLog();
  }, []);

  const eliminarCentroLogistico = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      try {
        await deleteCentrosLog(id);
        await obtenerCentrosLog();
        setOpenSnackbar(true);
        onClose();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    useEffect(() => {
      const filteredItems = centrosLog.filter((centroLog) =>
        centroLog.nombrecl.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCurrentItems(filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage));
    }, [searchTerm, centrosLog, page, itemsPerPage]); 
  
    const [currentItems, setCurrentItems] = useState([]);
  
    const totalPages = Math.ceil(centrosLog.length / itemsPerPage);
  
    const handlePrevPage = () => {
      setPage((prevPage) => Math.max(prevPage - 1, 1));
    };
  
    const handleNextPage = () => {
      setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

  return (
    <>
      <NavBar />
      <Box
        sx={{
          backgroundImage: "url(/assets/background.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Container>
          <Typography
            variant="h4"
            align="center"
            sx={{
              color: "#10295E",
              fontWeight: "bold",
              mt: 1,
              mb: 1,
              fontFamily: "Oswald, sans-serif"
            }}
          >
            Centros Logísticos
          </Typography>
          <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '80%', margin: '0 auto', gap: 5 }}>
            <TextField
              label="Buscar Centro"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#10295E', // Cambia el color del borde en el focus
                  },
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Open Sans, sans-serif', // Cambia la familia de fuentes
                },
              }}
            />          
            <Button
              startIcon={<AddBusiness />}
              onClick={() => setdrawerCrearCentro(true)}
              variant="contained"
              sx={{
                backgroundColor: "#10295E",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#ffffff",
                  color: "#10295E",
                },
              }}
            >
              Agregar
            </Button>
          </Container>
          <List sx={{ width: "80%", bgcolor: "background.paper", borderRadius: 2 , margin: "0 auto"}}>
          {currentItems.map((centroLog, index) => {
            console.log("Imagen cruda:", centroLog.imagen);

            const src = centroLog.imagen.startsWith("static/")
              ? `http://localhost:8000/${centroLog.imagen}`
              : `http://localhost:8000/media/${centroLog.imagen}`;

            return (
              <React.Fragment key={centroLog.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      src={
                        imagenesDjango.includes(centroLog.imagen.split("/").pop())
                          ? `http://localhost:8000/static/assets/images/centros/${centroLog.imagen.split("/").pop()}`
                          : `http://localhost:8000${centroLog.imagen}`
                      }
                      alt={centroLog.nombrecl}
                      sx={{ width: 64, height: 64, mr: 2 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: "regular", fontSize: "1rem", fontFamily: "Open Sans, sans-serif", }}>
                        {centroLog.nombrecl}
                      </Typography>
                    }
                  />
                  <Box sx={{ display: "flex", justifyContent: "flex-end", flexGrow: 1, gap: 2}}>
                    <IconButton 
                      aria-label="Editar"
                      onClick={() => {
                        setCentroLogIdSeleccionado(centroLog.id);
                        setdrawerEditarCentro(true);
                      }}
                      sx={{
                        backgroundColor: "#10295E",
                        color: "#ffffff",
                        mb: 2,
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          color: "#10295E",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="Eliminar"
                      onClick={() => {
                        console.log("ID a eliminar:", centroLog.id);
                        eliminarCentroLogistico(centroLog.id);
                      }}
                      sx={{
                        backgroundColor: "#FD5653",
                        color: "#ffffff",
                        mb: 2,
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          color: "#FD5653",
                        },
                      }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                
                {index < currentItems.length - 1 && <Divider />}

              </React.Fragment>
            );
          })}
          </List>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Button onClick={handlePrevPage} disabled={page === 1}>
              Anterior
            </Button>
            <Typography sx={{ mx: 2, lineHeight: '2' }}>
              Página {page} de {totalPages}
            </Typography>
            <Button onClick={handleNextPage} disabled={page === totalPages}>
              Siguiente
            </Button>
          </Box>
        </Container>
        <DrawerCentrosLog 
            open={drawerCrearCentro} 
            onClose={() => setdrawerCrearCentro(false)} 
            listaCentrosLog={centrosLog}
            onActualizar={obtenerCentrosLog} />
        <EditarCentrosLog
          centrologId={centroLogIdSeleccionado}
          open={drawerEditarCentro}
          onClose={() => setdrawerEditarCentro(false)}
          listaCentrosLog={centrosLog}
          onActualizar={obtenerCentrosLog}
        />
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity="warning" 
          sx={{ width: '100%' }}
        >
          Registro eliminado correctamente
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default Index;
