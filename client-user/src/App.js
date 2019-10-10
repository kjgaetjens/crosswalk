import React from 'react';

//maybe move this into another component

function App(props) {

  const session = props.match.params.session

  //could control state of current location or could just send onclick
  const sendLocation = () => {

    const success = (position) => {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude

      //how to make it fetch the appropriate url? grab the current url and extract a string and store it in state?
      fetch(`http://localhost:3001/add-location`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"sessionname": session, "lat": latitude, "long": longitude})
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
    <div className="addLocation">
      <h1>Walkable</h1>
      <button className="btn btn-primary btn-block" onClick={() => sendLocation()}><h1>I want to cross here</h1></button>
    </div>
  );
}

export default App;
