import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
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

const Weather = ({ setBackgrounds }) => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [location, setLocation] = useState({});
  const [error, setError] = useState(null);

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

  const getTemperature = (tempCelsius) => {
    return isFahrenheit ? Math.floor(tempCelsius * 9 / 5 + 32) : tempCelsius;
  };

  const search = async (city) => {
    if (city === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se hizo ningún Ingreso",
      });
      return;
    }
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(weatherUrl);
      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ingresar una Ciudad Existente",
        });
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

      // Llamada a la API de Pexels para obtener imágenes de fondo
      const pexelsUrl = `https://api.pexels.com/v1/search?query=${city}&per_page=5`; // 5 imágenes de alta calidad
      const pexelsResponse = await fetch(pexelsUrl, {
        headers: {
          Authorization: 'pzSG0wdXcOoQyz4hU2AKvAkpfBYVkvWcsVnDXhr2uRmvFNWRWCKUe72s',
        },
      });
      const pexelsData = await pexelsResponse.json();

      if (pexelsData.photos && pexelsData.photos.length > 0) {
        const images = pexelsData.photos.map(photo => photo.src.landscape); // Imágenes adaptadas al fondo
        setBackgrounds(images); // Actualiza las imágenes de fondo en App
      } else {
        setBackgrounds([]);
      }

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al obtener los datos del clima",
      });
      setWeatherData(false);
      console.error("Error en fetching weather data");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      search(inputRef.current.value);
    }
  };

  const handleTemperatureClick = () => {
    setIsFahrenheit(true);
    document.body.style.cursor = 'pointer';
  };

  const handleTemperatureRelease = () => {
    setIsFahrenheit(false);
    document.body.style.cursor = 'default';
  };

  // Obtiene la ubicación automáticamente usando geolocalización
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
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.message,
            });
            setError(error.message);
          }
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'La geolocalización no es soportada por este navegador.',
        });
        setError('La geolocalización no es soportada por este navegador.');
      }
    };

    getLocation();
  }, []);

  // Fetch de la ciudad utilizando la latitud y longitud obtenidas
  useEffect(() => {
    const fetchCity = async () => {
      if (location.latitude && location.longitude) {
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${location.latitude}+${location.longitude}&key=${import.meta.env.VITE_APP_ID2}`
          );
          const data = await response.json();
          if (data.results.length > 0) {
            let detectedCity = data.results[0].components.city ||
              data.results[0].components.town ||
              data.results[0].components.village ||
              'Ciudad no encontrada';

            // Si la ciudad detectada es "Lima Metropolitan Area", cambiarla a "Lima"
            if (detectedCity === "Lima Metropolitan Area") {
              detectedCity = "Lima";
            }

            setCity(detectedCity);
            search(detectedCity); // Realiza la búsqueda del clima para la ciudad detectada
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error al obtener los datos de la ciudad.",
          });
          setError('Error al obtener los datos de la ciudad.');
        }
      }
    };

    fetchCity();
  }, [location]);

  return (
    <div className='weather'>
      <div className='encabezado'>
        <img className='logo-app' src={weather_icon} alt="" />
        <div className='tittle-app'>Clima-X</div>
      </div>
      
      <div className='geolocalizacion'>
        <img className='location-img' src={location_icon} alt="" />
        <p>{city || "Ubicación no detectada"}</p>
      </div>

      <div className='search-bar'>
        <input 
          ref={inputRef} 
          type="text" 
          placeholder='Ciudad' 
          onKeyDown={handleKeyDown} 
        />
        <img 
          className='search-bar-img'  
          src={search_icon} 
          alt="" 
          onClick={() => search(inputRef.current.value)} 
        />
      </div>

      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="" className='weather-icon' />
          <p
            className='temperature'
            onMouseDown={handleTemperatureClick}
            onMouseUp={handleTemperatureRelease}
          >
            {getTemperature(weatherData.temperature)}°{isFahrenheit ? 'F' : 'C'}
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
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Viento</span>
              </div>
            </div>
          </div>
        </>
      ) : <></>}
    </div>
  );
}

export default Weather;
