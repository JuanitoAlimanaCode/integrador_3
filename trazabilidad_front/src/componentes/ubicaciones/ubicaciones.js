import React, { useState, useEffect } from 'react';
import NavBar from '../index/NavBar';
import DrawerUbicaciones from './crearDrawer';
import EditarUbicaciones from './editarDrawer';
import { getUbicaciones, setUbicaciones, editUbicaciones, deleteUbicaciones } from "../../servicios/trazappservicios";
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  TextField,
  Divider, 
  IconButton, 
  Snackbar 
} from '@mui/material';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MuiAlert from '@mui/material/Alert';

const Ubicacion = () => {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [ubicacionesId, setUbicacionesId] = useState(null);
    const [drawerCrearUbicaciones, setdrawerCrearUbicaciones] = useState(false);
    const [drawerEditarUbicaciones, setdrawerEditarUbicaciones] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const [searchTerm, setSearchTerm] = useState('');

    const obtenerUbicaciones = async () => {
      const response = await getUbicaciones();
      console.log("Datos recibidos de la API:", response); 
      setUbicaciones(response);
    };
  
    useEffect(() => {
      obtenerUbicaciones();
    }, []);

    const handleEditarClick = (ubicacion) => {
        setUbicacionesId(ubicacion.id);
        setdrawerEditarUbicaciones(true); 
      };

    const handleEliminarClick = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
          try {
            await deleteUbicaciones(id);
            await obtenerUbicaciones();
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error al eliminar:', error);
          }
        }
      };

      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
    
      useEffect(() => {
        const filteredItems = ubicaciones.filter((ubicaciones) =>
          ubicaciones.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCurrentItems(filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage));
      }, [searchTerm, ubicaciones, page, itemsPerPage]); 
    
      const [currentItems, setCurrentItems] = useState([]);
    
      const totalPages = Math.ceil(ubicaciones.length / itemsPerPage);
    
      const handlePrevPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
      };
    
      const handleNextPage = () => {
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
      };
    

    return  (
        <>
            <NavBar />
            <Box
                    sx={{
                    backgroundImage: 'url(/assets/background_9.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '90vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
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
                    Ubicaciones
                    </Typography>
                    <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '80%', margin: '0 auto', gap: 5 }}>
                        <TextField
                        label="Buscar Ubicación"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            width: '100%',
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
                        startIcon={<AutoAwesomeMosaicIcon />}
                        onClick={() => setdrawerCrearUbicaciones(true)}
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
                    <List sx={{ width: "80%", bgcolor: "background.paper", borderRadius: 2, margin: "0 auto" }} dense>
                        {currentItems.map((ubicacion, index) => (
                        <React.Fragment key={ubicacion.id}>
                            <ListItem sx={{ padding: '16 px 0px' }}>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: "flex", justifyContent: "left", gap: 2, }}>
                                    <Typography sx={{ fontWeight: "regular", fontSize: "1rem", fontFamily: "Open Sans, sans-serif", color: "#10295E", textAlign: 'center', }}>
                                        {ubicacion.ubicacion}
                                    </Typography>
                                    <Typography sx={{ fontWeight: "regular", fontSize: "1rem", fontFamily: "Open Sans, sans-serif", color: "#2C98CB", textAlign: 'center', }}>
                                        {ubicacion.grupo?.nombre}
                                    </Typography>
                                    <Typography sx={{ fontWeight: "regular", fontSize: "1rem", fontFamily: "Open Sans, sans-serif", color: "#FD5653", textAlign: 'center', }}>
                                        {ubicacion.tipo?.nombre}
                                    </Typography>
                                    </Box>
                                }
                            />
                            <Box sx={{ display: "flex", justifyContent: "flex-end", flexGrow: 1, gap: 2}}>
                            <IconButton onClick={() => 
                                handleEditarClick(ubicacion)}
                                sx={{
                                backgroundColor: "#10295E",
                                color: "#ffffff",
                                mb: 2,
                                "&:hover": {
                                    backgroundColor: "#ffffff",
                                    color: "#10295E",
                                },
                                }}>
                                <EditIcon />
                            </IconButton>   
                            <IconButton 
                            aria-label="Eliminar"
                            onClick={() => {
                                handleEliminarClick(ubicacion.id);
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
                        ))}
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
            </Box>
            <DrawerUbicaciones 
            open={drawerCrearUbicaciones} 
            onClose={() => setdrawerCrearUbicaciones(false)} 
            listaUbicaciones={ubicaciones || []}
            onActualizar={obtenerUbicaciones} 
            />
            <EditarUbicaciones
                open={drawerEditarUbicaciones}
                ubicacionesId={ubicacionesId}
                onClose={() => setdrawerEditarUbicaciones(false)} 
                listaUbicaciones={ubicaciones || []}
                onActualizar={obtenerUbicaciones}  
            /> 
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

export default Ubicacion;