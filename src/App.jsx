import React, { useState, useEffect } from 'react';
import Weather from './components/Weather';

const App = () => {
  const [backgrounds, setBackgrounds] = useState([]); // Estado para almacenar las imágenes de fondo
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0); // Índice del fondo actual
  const [isLoaded, setIsLoaded] = useState(false); // Estado para verificar si las imágenes han sido cargadas

  // Efecto para pre-cargar imágenes
  useEffect(() => {
    if (backgrounds.length > 0) {
      const preloadImages = backgrounds.map(src => {
        const img = new Image();
        img.src = src;
        return img;
      });

      // Esperar a que todas las imágenes se hayan cargado
      Promise.all(preloadImages.map(img => img.decode()))
        .then(() => setIsLoaded(true))
        .catch(error => console.error('Error preloading images:', error));
    }
  }, [backgrounds]);

  // Efecto para cambiar el fondo cada 4 segundos si las imágenes están cargadas
  useEffect(() => {
    if (isLoaded) {
      const interval = setInterval(() => {
        setCurrentBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
      }, 4000);

      return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
    }
  }, [isLoaded, backgrounds]);

  return (
    <div 
      style={{ 
        backgroundImage: isLoaded && backgrounds.length > 0 
          ? `url(${backgrounds[currentBackgroundIndex]})` 
          : `url(${import.meta.env.VITE_DEFAULT_BACKGROUND})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        transition: "background-image 1s ease-in-out", // Transición suave entre cambios de fondo
        width: "100%", // Asegura que el fondo cubra todo el ancho
        height: "100%", // Asegura que el fondo cubra todo el alto
        overflow: "hidden", // Evita que el contenido se desborde
      }} 
      className='app'
    >
      <Weather setBackgrounds={setBackgrounds} /> {/* Pasamos setBackgrounds a Weather */}
    </div>
  );
}

export default App;