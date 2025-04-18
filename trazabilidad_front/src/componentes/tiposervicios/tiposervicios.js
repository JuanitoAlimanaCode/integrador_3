import React, { useState, useEffect } from 'react';
import NavBar from '../index/NavBar';
import DrawerTipoServicios from './crearDrawer';
import EditarTipoServicios from './editarTipo';
import { getTipoServicios, setTipoServicios, editTipoServicios, deleteTipoServicios } from "../../servicios/trazappservicios";
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
import AddRoadIcon from '@mui/icons-material/AddRoad';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MuiAlert from '@mui/material/Alert';

const TipoServicios = () => {

    const [tiposervicios, setTiposervicios] = useState([]);
    const [tiposerviciosId, setTiposerviciosId] = useState(null);
    const [drawerCrearTipoServicios, setdrawerCrearTipoServicios] = useState(false);
    const [drawerEditarTipoServicios, setdrawerEditarTipoServicios] = useState(false);  // Estado para el Drawer de editar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const [searchTerm, setSearchTerm] = useState('');

    const obtenerTiposervicios = async () => {
        try {
            const response = await getTipoServicios();
            setTiposervicios(response); 
        } catch (error) {
            console.error("Error al obtener los tipos de servicios:", error);
        }
    };

    useEffect(() => {
        obtenerTiposervicios();
    }, []);

    const handleEditarClick = (tipo) => {
        console.log(tipo.id);
        setTiposerviciosId(tipo.id);  
        setdrawerEditarTipoServicios(true);  
      };

    const handleEliminarClick = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
        try {
            await deleteTipoServicios(id);
            await obtenerTiposervicios();
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
        }
    };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    const filteredItems = tiposervicios.filter((tipo) =>
      tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCurrentItems(filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage));
  }, [searchTerm, tiposervicios, page, itemsPerPage]); 

  const [currentItems, setCurrentItems] = useState([]);

  const totalPages = Math.ceil(tiposervicios.length / itemsPerPage);

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
                    backgroundImage: 'url(/assets/background_8.jpg)',
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
                        fontWeight: 'bold',
                        mt: 1,
                        mb: 1,
                        fontFamily: "Oswald, sans-serif"
                        }}
                    >
                        Tipos de Servicios <br />
                    </Typography>
                    <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '80%', margin: '0 auto', gap: 5 }}>
                        <TextField
                            label="Buscar Tipo de Servicio"
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
                            startIcon={<AddRoadIcon />}
                            onClick={() => setdrawerCrearTipoServicios(true)}
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
                    {currentItems.map((tipo, index) => {
                        console.log("Tipo recibido:", JSON.stringify(tipo, null, 2));;
                        return (
                        <React.Fragment key={tipo.id}>
                            <ListItem sx={{ padding: '16 px 0 px' }}>
                            <ListItemText
                                primary={
                                <Typography sx={{ fontWeight: "regular", fontSize: "1rem", fontFamily: "Open Sans, sans-serif", color: "#10295E" }}>
                                    {tipo.nombre}
                                </Typography>
                                }
                            />
                            <Box sx={{ display: "flex", justifyContent: "flex-end", flexGrow: 1, gap: 2}}>
                                <IconButton onClick={() => 
                                handleEditarClick(tipo)}
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
                                    handleEliminarClick(tipo.id);
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
            </Box>
            
            <DrawerTipoServicios 
                open={drawerCrearTipoServicios} 
                onClose={() => setdrawerCrearTipoServicios(false)} 
                listaTipoServicios={tiposervicios || []}
                onActualizar={obtenerTiposervicios} 
            />
            <EditarTipoServicios
                open={drawerEditarTipoServicios}
                tiposerviciosId={tiposerviciosId}
                onClose={() => setdrawerEditarTipoServicios(false)} 
                listaTipoServicios = {tiposervicios}
                onActualizar={obtenerTiposervicios}  
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

export default TipoServicios;