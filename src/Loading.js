import React, { useState, useEffect } from 'react';
import './Loading.css';

function Loading(props) {
  const { message } = props;
  return (
    <div className="Loading">
      <p>Waiting for weather data...</p>
    </div>
  );
}

export default Loading;
