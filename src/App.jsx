import React, { useState, useEffect } from 'react';
import Weather from './components/Weather';

const App = () => {
  const [backgrounds, setBackgrounds] = useState([]); // Estado para almacenar las imágenes de fondo
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0); // Índice del fondo actual

  // Efecto para cambiar el fondo cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 4000);

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, [backgrounds]);

  return (
    <div 
      style={{ 
        backgroundImage: backgrounds.length > 0 
          ? `url(${backgrounds[currentBackgroundIndex]})` 
          : `url(${import.meta.env.VITE_DEFAULT_BACKGROUND})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        transition: "background-image 1s ease-in-out" // Transición suave entre cambios de fondo
      }} 
      className='app'
    >
      <Weather setBackgrounds={setBackgrounds} /> {/* Pasamos setBackgrounds a Weather */}
    </div>
  );
}

export default App;

