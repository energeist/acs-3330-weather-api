import React, { useState, useEffect } from 'react';
import RadioButton from './RadioButton';
import WeatherDisplay from './WeatherDisplay';
import Loading from './Loading';
import './Weather.css';

function Weather() {
  const [zip, setZip] = useState('');
  const [unit, setUnit] = useState('metric');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  async function fetchWeather() {
    const apiKey = process.env.REACT_APP_APIKEY;
    let response
    
    setIsLoaded(false);
    
    try {
      response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=${unit}`);

      const json = await response.json();
      const cod = json.cod;
      const message = json.message;

      if (cod !== 200) {
        setWeatherData({ cod, message });

        setIsLoaded(true);
        return;
      }

      const temp = json.main.temp;
      const feelsLike = json.main.feels_like;
      const icon = json.weather[0].icon;
      const description = json.weather[0].description;

      setWeatherData({
        unit,
        temp,
        feelsLike,
        icon,
        description,
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
