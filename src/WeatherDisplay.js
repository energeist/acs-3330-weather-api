// import React, { useState, useEffect } from 'react';
import './WeatherDisplay.css';

function WeatherDisplay(props) {
  const { unit, temp, location, feelsLike, icon, description, humidity, visibility, cod, message } = props;

  if (cod !== 200) {
    return (
      <small>Error: {message}</small>  
    );
  }

  let tempSymbol = ""

  if (unit === 'imperial') {
    tempSymbol = ' °F'
  } else if (unit === 'metric') {
    tempSymbol = ' °C'
  } else {
    tempSymbol = 'K';
  }
  return (
    <div className="WeatherDisplay">
      <h2>Location: {location}</h2>
      <div className="upperSection">
        <div className="temperature">
          <h1>{parseFloat(temp).toFixed(1)}{tempSymbol}</h1>
          <small>Feels like: {feelsLike}{tempSymbol}</small>
        </div>
        <img src={`http://openweathermap.org/img/wn/${icon}.png`} alt={description} />
      </div>
      <div>
        <p>{description}</p>
        <p>Humidity: {humidity}</p>
        <p>Visibility: {visibility} ft</p>
      </div>
    </div>
  );
}

export default WeatherDisplay;
