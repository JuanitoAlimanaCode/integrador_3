import React, { useState, useEffect } from 'react';
import NavBar from '../index/NavBar';
import DrawerServicios from './crearDrawer';
import EditarServicios from './editarDrawer';
import { getServicios, setServicios, editServicios, deleteServicios } from "../../servicios/trazappservicios";
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
import AddchartIcon from '@mui/icons-material/Addchart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MuiAlert from '@mui/material/Alert';

const Servicios = () => {
    const [servicios, setServicios] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [serviciosId, setServiciosId] = useState(null);
    const [drawerCrearServicios, setdrawerCrearServicios] = useState(false);
    const [drawerEditarServicios, setdrawerEditarServicios] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const [searchTerm, setSearchTerm] = useState('');

    const obtenerServicios = async () => {
      const response = await getServicios();
      console.log("Datos recibidos de la API:", response); 
      setServicios(response);
    };
  
    useEffect(() => {
      obtenerServicios();
    }, []);

    const handleEditarClick = (servicio) => {
        setServiciosId(servicio.id);
        setdrawerEditarServicios(true); 
      };

    const handleEliminarClick = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
          try {
            await deleteServicios(id);
            await obtenerServicios();
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error al eliminar:', error);
          }
        }
      };

      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
    
      useEffect(() => {
        const filteredItems = servicios.filter((servicios) =>
          servicios.servicio.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCurrentItems(filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage));
      }, [searchTerm, servicios, page, itemsPerPage]); 
    
      const [currentItems, setCurrentItems] = useState([]);
    
      const totalPages = Math.ceil(servicios.length / itemsPerPage);
    
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
                    backgroundImage: 'url(/assets/background_3.jpg)',
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
                    Servicios
                    </Typography>
                    <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '80%', margin: '0 auto', gap: 5 }}>
                        <TextField
                        label="Buscar Servicio"
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
                        startIcon={<AddchartIcon />}
                        onClick={() => setdrawerCrearServicios(true)}
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
                        {currentItems.map((servicio, index) => (
                        <React.Fragment key={servicio.id}>
                            <ListItem sx={{ padding: '16 px 0px' }}>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: "flex", justifyContent: "left", gap: 2, }}>
                                    <Typography sx={{ fontWeight: "regular", fontSize: "1rem", fontFamily: "Open Sans, sans-serif", color: "#10295E", textAlign: 'center', }}>
                                        {servicio.servicio}
                                    </Typography>
                                    <Typography sx={{ fontWeight: "regular", fontSize: "1rem", fontFamily: "Open Sans, sans-serif", color: "#2C98CB", textAlign: 'center', }}>
                                        {servicio.grupo?.nombre}
                                    </Typography>
                                    <Typography sx={{ fontWeight: "regular", fontSize: "1rem", fontFamily: "Open Sans, sans-serif", color: "#FD5653", textAlign: 'center', }}>
                                        {servicio.tipo?.nombre}
                                    </Typography>
                                    </Box>
                                }
                            />
                            <Box sx={{ display: "flex", justifyContent: "flex-end", flexGrow: 1, gap: 2}}>
                            <IconButton onClick={() => 
                                handleEditarClick(servicio)}
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
                                handleEliminarClick(servicio.id);
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
            <DrawerServicios 
            open={drawerCrearServicios} 
            onClose={() => setdrawerCrearServicios(false)} 
            listaServicios={servicios || []}
            onActualizar={obtenerServicios} 
            /> 
            <EditarServicios
                open={drawerEditarServicios}
                serviciosId={serviciosId}
                onClose={() => setdrawerEditarServicios(false)} 
                listaServicios={servicios || []}
                onActualizar={obtenerServicios}  
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

export default Servicios;