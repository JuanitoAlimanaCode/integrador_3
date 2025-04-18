import React, { useState, useEffect } from 'react';
import NavBar from '../index/NavBar';
import DrawerTarifas from './crearDrawer';
import EditarTarifas from './editarDrawer';
import { getTarifas } from "../../servicios/trazappservicios";
import {
  Box,
  Button,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MuiAlert from '@mui/material/Alert';

const Tarifas = () => {
  const [tarifas, setTarifas] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tarifasId, setTarifasId] = useState(null);
  const [drawerCrearTarifas, setdrawerCrearTarifas] = useState(false);
  const [drawerEditarTarifas, setdrawerEditarTarifas] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const [clienteFilter, setClienteFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [grupoFilter, setGrupoFilter] = useState('');
  const [servicioFilter, setServicioFilter] = useState('');
  const [currentItems, setCurrentItems] = useState([]);
  const totalPages = Math.ceil(tarifas.length / itemsPerPage);

  const obtenerTarifas = async () => {
    const response = await getTarifas();
    console.log("Datos recibidos de la API:", response);
    setTarifas(response);
  };

  useEffect(() => {
    obtenerTarifas();
  }, []);

  const handleEditarClick = (tarifa) => {
    setTarifasId(tarifa.id);
    setdrawerEditarTarifas(true);
  };

  const handleEliminarClick = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      try {
        // Suponiendo que tienes una función deleteTarifas en tus servicios
        // await deleteTarifas(id);
        await obtenerTarifas();
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  useEffect(() => {
    const filteredItems = tarifas.filter((tarifa) => {
      const clienteMatch = !clienteFilter || tarifa.cliente?.nombre?.toLowerCase()?.includes(clienteFilter.toLowerCase());
      const tipoMatch = !tipoFilter || tarifa.tipo?.nombre?.toLowerCase()?.includes(tipoFilter.toLowerCase());
      const grupoMatch = !grupoFilter || tarifa.grupo?.nombre?.toLowerCase()?.includes(grupoFilter.toLowerCase());
      const servicioMatch = !servicioFilter || tarifa.servicio?.nombre?.toLowerCase()?.includes(servicioFilter.toLowerCase());
      const searchTermMatch = !searchTerm ||
        String(tarifa.tarifa).toLowerCase().includes(searchTerm.toLowerCase()) ||
        tarifa.cliente?.nombre?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        tarifa.tipo?.nombre?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        tarifa.grupo?.nombre?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        tarifa.servicio?.nombre?.toLowerCase()?.includes(searchTerm.toLowerCase());

      return clienteMatch && tipoMatch && grupoMatch && servicioMatch && searchTermMatch;
    });
    setCurrentItems(filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage));
  }, [clienteFilter, tipoFilter, grupoFilter, servicioFilter, searchTerm, tarifas, page, itemsPerPage]);

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
          backgroundImage: 'url(/assets/background_10.jpg)',
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
            Tarifas
          </Typography>
          <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '80%', margin: '0 auto', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%', maxWidth: '600px' }}>
              <FormControl fullWidth size="small">
                <InputLabel id="cliente-filter-label">Cliente</InputLabel>
                <Select
                  labelId="cliente-filter-label"
                  id="cliente-filter"
                  value={clienteFilter}
                  label="Cliente"
                  onChange={(e) => setClienteFilter(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {[...new Set(tarifas.map(tarifa => tarifa.cliente?.nombre).filter(Boolean))].map((cliente) => (
                    <MenuItem key={cliente} value={cliente}>{cliente}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="tipo-filter-label">Tipo</InputLabel>
                <Select
                  labelId="tipo-filter-label"
                  id="tipo-filter"
                  value={tipoFilter}
                  label="Tipo"
                  onChange={(e) => setTipoFilter(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {[...new Set(tarifas.map(tarifa => tarifa.tipo?.nombre).filter(Boolean))].map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%', maxWidth: '600px' }}>
              <FormControl fullWidth size="small">
                <InputLabel id="grupo-filter-label">Grupo</InputLabel>
                <Select
                  labelId="grupo-filter-label"
                  id="grupo-filter"
                  value={grupoFilter}
                  label="Grupo"
                  onChange={(e) => setGrupoFilter(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {[...new Set(tarifas.map(tarifa => tarifa.grupo?.nombre).filter(Boolean))].map((grupo) => (
                    <MenuItem key={grupo} value={grupo}>{grupo}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="servicio-filter-label">Servicio</InputLabel>
                <Select
                  labelId="servicio-filter-label"
                  id="servicio-filter"
                  value={servicioFilter}
                  label="Servicio"
                  onChange={(e) => setServicioFilter(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {[...new Set(tarifas.map(tarifa => tarifa.servicio?.nombre).filter(Boolean))].map((servicio) => (
                    <MenuItem key={servicio} value={servicio}>{servicio}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="Buscar en todas las categorías"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#10295E',
                  },
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Open Sans, sans-serif',
                },
              }}
            />
            <Button
              startIcon={<AddShoppingCartIcon />}
              onClick={() => setdrawerCrearTarifas(true)}
              variant="contained"
              sx={{
                backgroundColor: "#10295E",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#ffffff",
                  color: "#10295E",
                },
                // Adjust width for smaller screens
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              +
            </Button>
          </Container>
          <List sx={{ width: "80%", bgcolor: "background.paper", borderRadius: 2, margin: "0 auto" }} dense>
            {currentItems.map((tarifa, index) => (
              <React.Fragment key={tarifa.id}>
                <ListItem sx={{ padding: '16 px 0px' }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", justifyContent: "space-between", }}>
                        <Box sx={{ display: "flex", gap: 2, }}>
                          <Typography sx={{ fontWeight: "bold", fontSize: "1rem", fontFamily: "Open Sans, sans-serif", color: "#10295E", textAlign: 'center', }}>
                            {tarifa.cliente?.nombre}
                          </Typography>
                          <Typography sx={{ fontWeight: "regular", fontSize: "1rem", fontFamily: "Open Sans, sans-serif", color: "#10295E", textAlign: 'center', }}>
                            {tarifa.tipo?.nombre}
                          </Typography>
                          <Typography sx={{ fontWeight: "regular", fontSize: "1rem", fontFamily: "Open Sans, sans-serif", color: "#2C98CB", textAlign: 'center', }}>
                            {tarifa.grupo?.nombre}
                          </Typography>
                          <Typography sx={{ fontWeight: "regular", fontSize: "1rem", fontFamily: "Open Sans, sans-serif", color: "#FD5653", textAlign: 'center', }}>
                            {tarifa.servicio?.nombre}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: "flex", gap: 2, justifyContent: "left" }}>
                        <Typography sx={{ fontWeight: "bold", fontSize: "1rem", fontFamily: "Open Sans, sans-serif", color: "#70AD47", textAlign: 'left', }}>
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(tarifa.tarifa)}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: "flex", justifyContent: "flex-end", flexGrow: 1, gap: 2 }}>
                    <IconButton onClick={() =>
                      handleEditarClick(tarifa)}
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
                        handleEliminarClick(tarifa.id);
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
      <DrawerTarifas
        open={drawerCrearTarifas}
        onClose={() => setdrawerCrearTarifas(false)}
        listaTarifas={tarifas || []}
        onActualizar={obtenerTarifas}
      />
      <EditarTarifas
        open={drawerEditarTarifas}
        tarifasId={tarifasId}
        onClose={() => setdrawerEditarTarifas(false)}
        listaTarifas={tarifas || []}
        onActualizar={obtenerTarifas}
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

export default Tarifas;