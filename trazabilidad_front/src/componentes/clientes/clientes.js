import React, { useState, useEffect } from 'react';
import NavBar from '../index/NavBar';
import { getClientes, setClientes, editClientes, deleteClientes } from "../../servicios/trazappservicios";
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
import DrawerClientes from './crearDrawer';
import EditarClientes from './editarClientes';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MuiAlert from '@mui/material/Alert';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState(null);
  const [drawerCrearClientes, setdrawerCrearClientes] = useState(false);
  const [drawerEditarClientes, setdrawerEditarClientes] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');

  const obtenerClientes = async () => {
    const response = await getClientes();
    console.log("Datos de clientes:", response);
    response.forEach(cliente => {
      console.log("Estructura de grupocliente:", cliente.grupocliente);
    });
    setClientes(response);
  };

  const handleEditarClick = (cliente) => {
    console.log(cliente.id);
    setClienteId(cliente.id);
    setdrawerEditarClientes(true); 
  };

  const handleEliminarClick = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      try {
        await deleteClientes(id);
        await obtenerClientes();
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    const filteredItems = clientes.filter((cliente) =>
      cliente.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCurrentItems(filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage));
  }, [searchTerm, clientes, page, itemsPerPage]); 

  const [currentItems, setCurrentItems] = useState([]);

  const totalPages = Math.ceil(clientes.length / itemsPerPage);

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
          backgroundImage: 'url(/assets/background_2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >     
        <Container>     
          <Typography variant="h4" align="center" sx={{ fontFamily: "Trebuchet MS", color: "#10295E", mt:1 , mb: 1, fontFamily: "Oswald, sans-serif" }}>
            Clientes   
          </Typography>
          <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '80%', margin: '0 auto', gap: 5 }}>
            <TextField
              label="Buscar Cliente"
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
              startIcon={<GroupAddIcon />}
              onClick={() => setdrawerCrearClientes(true)}
              variant="contained"
              sx={{
                backgroundColor: "#10295E",
                color: "#ffffff",
                mb: 1,
                "&:hover": {
                  backgroundColor: "#ffffff",
                  color: "#10295E",
                },
              }}
            >
              Agregar
            </Button>
          </Container>
          <List sx={{ width: "80%", bgcolor: "background.paper", borderRadius: 2, margin: "0 auto" }}>
            {currentItems.map((cliente, index) => (
              <React.Fragment key={cliente.id}>
                <ListItem>
                {console.log("Grupo del cliente:", cliente)} 
                    <ListItemText
                        primary={
                            <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                                {cliente.cliente}
                            </Typography>
                        }
                        secondary={
                            <Typography sx={{ fontWeight: "regular", fontSize: "1rem", color: "#10295E" }}>
                                {cliente.grupocliente.nombre}
                            </Typography>
                        }
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", flexGrow: 1, gap: 2}}>
                      <IconButton onClick={() => 
                        handleEditarClick(cliente)}
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
                        handleEliminarClick(cliente.id);
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
      <DrawerClientes 
        open={drawerCrearClientes} 
        onClose={() => setdrawerCrearClientes(false)} 
        listaClientes={Clientes || []}
        onActualizar={obtenerClientes} 
      />
      <EditarClientes
        open={drawerEditarClientes}
        ClienteId={clienteId}
        onClose={() => setdrawerEditarClientes(false)} 
        listaClientes={clientes || []}
        onActualizar={obtenerClientes}  
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

export default Clientes;