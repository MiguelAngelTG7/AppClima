import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import weather_icon3 from '../assets/weather_icon3.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'


const Weather = () => {

  const inputRef = useRef()

  const [weatherData, setWeatherData] = useState(0);

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

  }

  //Obtiene los datos de la API del clima
  const search = async (city)=> {

    //Alerta cuando la búsqueda se hace sobre una entrada de país vacía
    if(city === ""){
      alert("Ingresa el Nombre de Ciudad");
      return;
    }
    //Obtiene datos especificos de la API
      try {
          const url =`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

          const response = await fetch(url);
          const data = await response.json();

          //Alerta de sistema cuando el nombre de la ciudad es incorrecto o no existe
          if(!response.ok){
              alert(data.message);
              return;
          }

          //Obtiene los codigos de iconos de la API
          const icon = allIcons[data.weather[0].icon] || clear_icon;

            //Obtiene los datos del clima
            setWeatherData({
              humidity: data.main.humidity,
              windSpeed: data.wind.speed,
              temperature: Math.floor(data.main.temp),
              location: data.name,
              country: data.sys.country,
              icon: icon
            })

      //Se muestra cuando hay un error al traer los datos del Clima de la API
      } catch (error) {
        
        setWeatherData(false);
        console.error("Error en fetching weather data")

      }

  }
    //Actuaiza cada vez que se cambia el nombre de la ciudad en búsqueda
    useEffect(()=>{
        search("Lima")

    },[])

  //Hace el Diseño de la App visible para el usuario
  return (
    <div className='weather'>
      
       <div className='encabezado'>
       <img className='logo-app' src={weather_icon3} alt="" />
       <div className='tittle-app'>Clima-X</div>
       </div>

       <div className='search-bar'>
            <input ref={inputRef} type="text" placeholder='Ciudad'/>
            <img src={search_icon} alt="" onClick={()=>search(inputRef.current.value)} />
       </div>

        {weatherData?
        
        /*Si la entrada es correcta entonces procede lo siguiente*/
        
        <>
        
        <img src={weatherData.icon} alt="" className='weather-icon'/>
        <p className='temperature'>{weatherData.temperature}°C</p>
        <p className='location'>{weatherData.location}</p>
        <p className='country'>{weatherData.country}</p>
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

        </>:<></>}
        
    </div>
  )

}
export default Weather

