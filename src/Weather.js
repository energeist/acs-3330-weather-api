import React, { useState, useEffect } from 'react';
import RadioButton from './RadioButton';
import LocalWeatherDisplay from './LocalWeatherDisplay';
import WeatherDisplay from './WeatherDisplay';
import Loading from './Loading';
import './Weather.css';

const apiKey = process.env.REACT_APP_APIKEY;

function Weather() {
  const [zip, setZip] = useState('');
  const [unit, setUnit] = useState('metric');
  const [weatherData, setWeatherData] = useState(null);
  const [localWeatherData, setLocalWeatherData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const localWeather = async () => {
      
    try {
      //eslint-disable-next-line
      const currentLocation = await navigator.geolocation.getCurrentPosition(success, error)       
      
      let lat;
      let lon;

      async function success(pos) {
        const crd = pos.coords;
        
        lat = crd.latitude;
        lon = crd.longitude;

        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);

        const unit = 'metric'
      
        const geoResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`);

        const json = await geoResponse.json();
        
        console.log(json)
        const temp = json.main.temp;
        const feelsLike = json.main.feels_like;
        const visibility = json.visibility;
        const humidity = json.main.humidity;
        const icon = json.weather[0].icon;
        const description = json.weather[0].description;
        const location = json.name;
        const cod = json.cod;
        const message = json.message;
        
        setLocalWeatherData({
          unit,
          temp,
          location,
          feelsLike,
          icon,
          description,
          humidity,
          visibility,
          cod,
          message
        });

        console.log("????????")
        console.log(localWeatherData)
      }

      async function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }

      console.log('lat', lat);
      
      
    } catch (error) {
      console.error('Error fetching weather data', error);
      return;
    }
  }
    localWeather();
  }, [localWeatherData])

  async function fetchWeather() {
    
    let response
    
    setIsLoaded(false);
    
    try {
      response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=${unit}`);

      const json = await response.json();
      const cod = json.cod;
      const message = json.message;

      console.log(json);

      if (cod !== 200) {
        setWeatherData({ cod, message });

        setIsLoaded(true);
        return;
      }

      const temp = json.main.temp;
      const feelsLike = json.main.feels_like;
      const visibility = json.visibility;
      const humidity = json.main.humidity;
      const icon = json.weather[0].icon;
      const description = json.weather[0].description;
      const location = json.name;

      setWeatherData({
        unit,
        temp,
        location,
        feelsLike,
        icon,
        description,
        humidity,
        visibility,
        cod,
        message
      });

      setIsLoaded(true);
    } catch (error) {
      console.error('Error fetching weather data', error);
      setWeatherData({ message: 'Error fetching weather data' });
      return;
    }
  }

  return (
    <div className="Weather">
      {
        localWeatherData
          ? <div>
              <h2>Your local weather</h2>
              <LocalWeatherDisplay {...localWeatherData} />
            </div>
          : <Loading />
      }
      { 
        isLoaded
          ? <div>
              <h2>Weather for zip code: {zip}</h2>
              <WeatherDisplay {...weatherData} />
            </div> 
          : <Loading /> 
      }
      <form
        onSubmit={(evt) => {
          console.log('submitting form')
          evt.preventDefault();
          fetchWeather();
        }}
      >
        <div>
          <input 
            placeholder ="Enter zip code"
            value={zip}
            onChange={evt => setZip(evt.target.value)}
          />
          <button
            type="submit"
          >Get Weather</button>
        </div>
        <select
          value={unit}
          onChange={evt => setUnit(evt.target.value)}
        >
          <option value="metric">Celsius</option>
          <option value="imperial">Fahrenheit</option>
          <option value="standard">Kelvin</option>
        </select>

        <RadioButton 
          label="metric"
          name="unit"
          checked={unit === 'metric'}
          onChange={() => setUnit('metric')}
        />

        <RadioButton 
          label="imperial"
          name="unit"
          checked={unit === 'imperial'}
          onChange={() => setUnit('imperial')}
        />

        <RadioButton 
          label="standard"
          name="unit"
          checked={unit === 'standard'}
          onChange={() => setUnit('standard')}
        />
      </form>
    </div>
  );
}

export default Weather;
