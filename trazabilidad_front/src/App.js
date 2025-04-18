import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./componentes/index/index.js";
import Menu from "./componentes/menu/index.js";
import Seleccion from "./componentes/index/seleccion.js";
import Login from "./componentes/cuenta/login.js";
import Registro from "./componentes/cuenta/registro.js";
import Perfil from "./componentes/cuenta/perfil.js";
import CentrosLog from "./componentes/centros_log/centroslog.js";
import GrupoClientes from "./componentes/grupoclientes/grupoclientes.js";
import Clientes from "./componentes/clientes/clientes.js";
import Ubicacion from "./componentes/ubicaciones/ubicaciones.js";
import TipoServicios from "./componentes/tiposervicios/tiposervicios.js";
import GrupoServicios from "./componentes/gruposervicios/gruposervicios.js";
import Servicios from "./componentes/desc_servicios/desc_servicios.js";
import Tarifas from "./componentes/tarifas/tarifas.js";
import Agregar from "./componentes/agregar/agregar.js";
import Seguimiento from "./componentes/agregar/seguimiento.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/seleccion" element={<Seleccion />} /> 
        <Route path="/centros_log" element={<CentrosLog />} />
        <Route path="/grupoclientes" element={<GrupoClientes />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/ubicacion" element={<Ubicacion />} />
        <Route path="/tiposervicios" element={<TipoServicios />} />
        <Route path="/gruposervicios" element={<GrupoServicios />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/tarifas" element={<Tarifas />} />
        <Route path="/agregar" element={<Agregar />} />
        <Route path="/seguimiento" element={<Seguimiento />} />
      </Routes>
    </Router>
  );
}

export default App;


//Original
/*
<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Bienvenido a Trazapp.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
*/