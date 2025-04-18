import React, { useState, useEffect } from 'react';
import NavBarCl from "../index/NavBarCl";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import './CarruselManual.css'; // Asegúrate de tener este archivo con estilos

const slidesData = [ // Declaración de slidesData fuera del componente
  {
    imageUrl: '/assets/main_01.jpg',
    altText: 'Imagen 1',
    title: 'Optimizando el Flujo',
    description: 'Registro de ingresos y salidas, seguimiento de Servicios de las unidades automotrices. Trazabilidad en tiempo real de las unidades, ubicación en tiempo real de las unidades.',
    linkUrl: '/Login',
    linkText: 'Ver más'
  },
  {
    imageUrl: '/assets/main_02.jpg',
    altText: 'Imagen 2',
    title: 'Registro Rápido',
    description: 'Registre el ingreso y salidas de unidades automotrices en segundos. Capture información esencial al instante.',
    linkUrl: '/Login',
    linkText: 'Ver más'
  },
  {
    imageUrl: '/assets/main_03.jpg',
    altText: 'Imagen 3',
    title: 'Centralización de Datos',
    description: 'Todos los datos de servicios y movimientos internos para una gestión eficiente. Evite errores y agilice procesos.',
    linkUrl: '/Login',
    linkText: 'Ver más'
  },
  {
    imageUrl: '/assets/main_04.jpg',
    altText: 'Imagen 4',
    title: 'Trazabilidad Interna',
    description: 'Seguimiento en tiempo real de las unidades, ubicación en tiempo real de las unidades.',
    linkUrl: '/Login',
    linkText: 'Ver más'
  },
  {
    imageUrl: '/assets/main_05.jpg',
    altText: 'Imagen 4',
    title: 'Control de Servicios y Taller',
    description: 'Conozca el estado de las unidades en tiempo real, servicios ejecutados y atenciones en taller.',
    linkUrl: '/Login',
    linkText: 'Ver más'
  },
];

const Index = () => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slidesData.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slidesData.length) % slidesData.length);
  };

  const currentSlide = slidesData[currentIndex];

  if (!currentSlide) {
    return <div>No hay slides para mostrar.</div>;
  }

  return (
    <>
      <NavBarCl />
      <Box
        sx={{
          backgroundImage: 'url(/assets/background_1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center', // Centrar el carrusel horizontalmente
          alignItems: 'center', // Centrar el carrusel verticalmente
        }}
      >
        <div className="carrusel-manual-container">
          <div className="slide-container">
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.altText}
              className="slide-image"
              style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
            />
            <div className="text-overlay">
              <h3>{currentSlide.title}</h3>
              <p>{currentSlide.description}</p>
              {currentSlide.linkUrl && (
                <a href={currentSlide.linkUrl} className="slide-link">
                  {currentSlide.linkText || 'Ver más'}
                </a>
              )}
            </div>
          </div>
          <div className="controls">
            <button onClick={goToPrevious} className="control-button">Anterior</button>
            <button onClick={goToNext} className="control-button">Siguiente</button>
          </div>
        </div>
      </Box>
        <div className="beneficios-container">
          <h2>¿Por qué TrazApp?</h2>
          <div className="beneficios">
            <div className="beneficio">
              <h3>Registro Rápido</h3>
              <p>Con Trazapp, cada centro logístico puede registrar el ingreso y salida de sus unidades en solo unos segundos. Con un clic, capturas toda la información esencial, lo que garantiza un proceso más ágil y preciso optimizando timpos muertos. Ideal para una gestión eficiente, sin complicaciones.</p>
            </div>
            <div className="beneficio">
              <h3>Trazabilidad en Tiempo Real</h3>
              <p>La trazabilidad en tiempo real te permite saber la ubicación exacta de cada unidad, garantizando una gestión más precisa y un control total de las operaciones. Puedes acceder a esta información desde cualquier dispositivo, mejorando la seguridad y optimizando los procesos logísticos en cualquier momento y lugar.</p>
            </div>
            <div className="beneficio">
              <h3>Gestión Completa</h3>
              <p>Desde la asignación de servicios hasta el seguimiento de los movimientos de cada unidad, TrazApp ofrece una gestión integral y centralizada. Controla los servicios de las unidades automotrices de manera remota, accediendo a todos los datos en tiempo real. Con una interfaz intuitiva, facilita la toma de decisiones y mejora la eficiencia operativa de tu negocio.</p>
            </div>
          </div>
          <button className="cta-button" onClick={() => navigate("/Login")}>¡Empieza Ahora!</button>
        </div>

        <div className="contacto-container">
          <h2>¿Tienes alguna pregunta?</h2>
          <p>Estamos aquí para ayudarte, ¡contáctanos!</p>
          <div className="contacto-info">
            <p>📱 Teléfono: +57 310 296 6913</p>
            <p>✉️ Correo: juanbenjumea@bergevigia.com</p>
            <button className="whatsapp-button">WhatsApp</button>
          </div>
        </div>
        <div className="footer-container">
          <p>&copy; 2025 Berge Vigía - Tecnología y Transformación. Todos los derechos reservados.</p>
          <p>Desarrollado por Juan Camilo Benjumea para <a href="https://www.bergevigia.com" target="_blank" rel="noopener noreferrer">
              <img src="/assets/logo_blanco_x.png" alt="TuEmpresa" className="footer-logo" />
            </a></p>
        </div>
    </>
  );
};

export default Index;