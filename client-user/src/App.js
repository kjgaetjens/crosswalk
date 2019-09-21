import React from 'react';

//maybe move this into another component

function App() {
  //could control state of current location or could just send onclick


  const sendLocation = () => {

    const success = (position) => {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      const location = {"lat": latitude, "long": longitude}

      fetch('http://localhost:3001/add-location', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(location)
      })

      //update status to say it was sent succesfully
    }

    const error = () => {
      //set status and display on page
      console.log('unable to retrieve location 2')
    }

    if (!navigator.geolocation) {
      //set status an display on page
      console.log('unable to retrieve location')
    } else {
      //set status and display on page
      console.log('locating')
      navigator.geolocation.getCurrentPosition(success,error)
    }
  }
  
  return (
    <button onClick={() => sendLocation()}>I want to cross</button>
  );
}

export default App;
