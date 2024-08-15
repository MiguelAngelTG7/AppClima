import React, { useState, useEffect } from 'react';
import './Geolocation.css'

function Geolocation() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Se ejecutará la conversión después de que las coordenadas sean obtenidas
  useEffect(() => {
    if (location.latitude && location.longitude) {
      const fetchCity = async () => {
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${location.latitude}+${location.longitude}&key=1780e6a5702348d3a8dea7f7525ac695`
          );
          const data = await response.json();
          if (data.results.length > 0) {
            setCity(data.results[0].components.city || data.results[0].components.town || data.results[0].components.village || 'Ciudad no encontrada');
          }
        } catch (error) {
          setError('Error fetching city data.');
        }
      };
      fetchCity();
    }
  }, [location]);

  return (
    <div className='geolocation-box'>
      {city ? <p>Geolocalización. {city}</p> : <p>Obteniendo ubicación...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default Geolocation;