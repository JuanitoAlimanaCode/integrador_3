import React, { useState, useEffect } from 'react';
import NavBar from '../index/NavBar';
import DrawerGrupoClientes from './crearDrawer';
import EditarGrupoClientes from './editarGrupo';
import { getGrupoClientes, setGrupoClientes, editGrupoClientes, deleteGrupoClientes } from "../../servicios/trazappservicios";
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
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MuiAlert from '@mui/material/Alert';

const Index = () => {
  
  const [grupoClientes, setgrupoClientesState] = useState([]);
  const [drawerCrearGrupoClientes, setdrawerCrearGrupoClientes] = useState(false);
  const [drawerEditarGrupoClientes, setdrawerEditarGrupoClientes] = useState(false);  // Estado para el Drawer de editar
  const [grupoClienteId, setgrupoClienteId] = useState(null);  // Estado para el grupo a editar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');

  const obtenerGrupoClientes = async () => {
    const response = await getGrupoClientes();
    setgrupoClientesState(response);
  };

  useEffect(() => {

    obtenerGrupoClientes();
  }, []);

  // Lógica para abrir el drawer de edición
  const handleEditarClick = (grupo) => {
    console.log(grupo.id);
    setgrupoClienteId(grupo.id);  
    setdrawerEditarGrupoClientes(true);  
  };

  const handleEliminarClick = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      try {
        await deleteGrupoClientes(id);
        await obtenerGrupoClientes();
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    const filteredItems = grupoClientes.filter((grupo) =>
      grupo.grupocliente.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCurrentItems(filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage));
  }, [searchTerm, grupoClientes, page, itemsPerPage]); 

  const [currentItems, setCurrentItems] = useState([]);

  const totalPages = Math.ceil(grupoClientes.length / itemsPerPage);

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
          backgroundImage: 'url(/assets/background_7.jpg)',
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
            Grupo Clientes
          </Typography>
          <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '80%', margin: '0 auto', gap: 5 }}>
            <TextField
              label="Buscar Grupo"
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
              startIcon={<LibraryAddIcon />}
              onClick={() => setdrawerCrearGrupoClientes(true)}
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

          {/* Lista de Grupos */}
          <List sx={{ width: "80%", bgcolor: "background.paper", borderRadius: 2, margin: "0 auto" }} dense>
            {currentItems.map((grupo, index) => (
              <React.Fragment key={grupo.id}>
                <ListItem sx={{ padding: '16 px 0px' }}>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: "regular", fontSize: "1rem", fontFamily: "Open Sans, sans-serif",color: "#10295E"}}>
                        {grupo.grupocliente}
                      </Typography>
                    }
                  />
                  <Box sx={{ display: "flex", justifyContent: "flex-end", flexGrow: 1, gap: 2}}>
                    <IconButton onClick={() => 
                      handleEditarClick(grupo)}
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
                        handleEliminarClick(grupo.id);
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

      {/* Drawer para Crear Grupo */}
      <DrawerGrupoClientes 
        open={drawerCrearGrupoClientes} 
        onClose={() => setdrawerCrearGrupoClientes(false)} 
        listaGrupoClientes={grupoClientes || []}
        onActualizar={obtenerGrupoClientes} 
      />
      
      {/* Drawer para Editar Grupo */}
      <EditarGrupoClientes
        open={drawerEditarGrupoClientes}
        grupoClienteId={grupoClienteId}  // Pasa el grupo a editar
        onClose={() => setdrawerEditarGrupoClientes(false)}  // Cierra el Drawer de edición
        listaGrupoClientes = {grupoClientes}
        onActualizar={obtenerGrupoClientes}  // Función para actualizar la lista después de editar
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

export default Index;
