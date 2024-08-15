import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import weather_icon from '../assets/weather_icon.png';
import location_icon from '../assets/location.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true); // Estado para controlar la unidad de temperatura

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  // Obtiene los datos de la API del clima
  const search = async (city) => {
    if (city === "") {
      alert("Ingresa el Nombre de Ciudad");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert("Ingresar una Ciudad Existente");
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        country: data.sys.country,
        icon: icon,
      });

    } catch (error) {
      setWeatherData(false);
      console.error("Error en fetching weather data");
    }
  };

  // Actualiza cada vez que se cambia el nombre de la ciudad en búsqueda
  useEffect(() => {
    search("Lima");
  }, []);

  // Obtiene la ciudad automáticamente usando geolocalización
  useEffect(() => {
    const getLocation = () => {
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
        setError('La geolocalización no es soportada por este navegador.');
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    const fetchCity = async () => {
      if (location.latitude && location.longitude) {
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${location.latitude}+${location.longitude}&key=1780e6a5702348d3a8dea7f7525ac695`);
          const data = await response.json();
          if (data.results.length > 0) {
            const detectedCity = data.results[0].components.city || 
                                data.results[0].components.town || 
                                data.results[0].components.village || 
                                'Ciudad no encontrada';
            setCity(detectedCity);
          }
        } catch (error) {
          setError('Error al obtener los datos de la ciudad.');
        }
      }
    };

    fetchCity();
  }, [location]);

  // Maneja el evento de la tecla ENTER
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      search(inputRef.current.value);
    }
  };

  // Convierte la temperatura entre Celsius y Fahrenheit
  const toggleTemperatureUnit = () => {
    if (weatherData) {
      const newTemp = isCelsius
        ? Math.floor((weatherData.temperature * 9/5) + 32) // Convierte a Fahrenheit
        : Math.floor((weatherData.temperature - 32) * 5/9); // Convierte a Celsius

      setWeatherData({
        ...weatherData,
        temperature: newTemp,
      });
      setIsCelsius(!isCelsius); // Cambia el estado de la unidad de temperatura
    }
  };

  return (
    <div className='weather'>
      <div className='encabezado'>
        <img className='logo-app' src={weather_icon} alt="" />
        <div className='tittle-app'>Clima-X</div>
      </div>
      <div className='geolocalizacion'>
        <img className='location-img' src={location_icon} alt="" />
        <p>{city}</p> {/* Mostrar la ciudad detectada */}
      </div>

      <div className='search-bar'>
        <input 
          ref={inputRef} 
          type="text" 
          placeholder='Ciudad' 
          onKeyDown={handleKeyDown} // Evento para manejar ENTER
        />
        <img 
          className='search-bar-img'  
          src={search_icon} 
          alt="" 
          onClick={() => search(inputRef.current.value)} 
        />
      </div>

      {weatherData ?
        <>
          <img src={weatherData.icon} alt="" className='weather-icon' />
          <p 
            className='temperature' 
            onClick={toggleTemperatureUnit} // Agrega el evento onClick
          >
            {weatherData.temperature}°{isCelsius ? 'C' : 'F'}
          </p>

          <div className='location-country'>
            <p className='location'>{weatherData.location}</p>
            <p className='country'>{weatherData.country}</p>
          </div>

          <div className='weather-data'>
            <div className='col'>
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity}</p>
                <span>Humedad</span>
              </div>
            </div>

            <div className='col'>
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed}Km/h</p>
                <span>Viento</span>
              </div>
            </div>
          </div>
        </> : <></>}
    </div>
  );
}

export default Weather;