import React,{useState, useEffect} from 'react';


function App(props) {

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  const serverURL = 'https://immense-citadel-99283.herokuapp.com';
  const session = props.match.params.session;

  const [active, setActive] = useState(false)
  const [alert, setAlert] = useState({type:'', message:''})

  
  const checkActive = () => {
    fetch(`${serverURL}/sessionstatus/${session}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      if (!response.ok) {
        setAlert({type:'alert-danger', message:'URL does not exist or is not Active'})
      }
      return response
    }).then(response => {
      return response.json()
    }).then(json => {
      if (json.status === 'ACTIVE') {
        setActive(true)
      } else {
        setAlert({type:'alert-danger', message:'URL does not exist or is not Active'})
      }
    }).catch(error => {
      setAlert({type:'alert-danger', message:'URL does not exist or is not Active'})
    })
  }

  const sendLocation = () => {

    setAlert({type:'alert-info', message:'Sending your location...'})

    const success = (position) => {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude

      fetch(`${serverURL}/add-location`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"sessionname": session, "lat": latitude, "long": longitude})
      }).then(response => {
        if (!response.ok) {
          setAlert({type:'alert-danger', message:'Unable to send your location.'})
        }
        return response
      }).then(response => {
        setAlert({type:'alert-success', message:'Success! Thank you for participating!'})
      }).catch(error => {
        setAlert({type:'alert-danger', message:'Unable to send your location.'})
      })

    }

    const error = () => {
      setAlert({type:'alert-danger', message:'Unable to retrieve location.'})
    }

    if (!navigator.geolocation) {
      setAlert({type:'alert-danger', message:'Unable to retrieve location.'})
    } else {
      navigator.geolocation.getCurrentPosition(success,error)
    }
  }

  useEffect(() => {
    checkActive()
  }, [])
  
  return (
    <div className="addLocation">
      <div className="header-div">
        <h1>Walkable</h1>
      </div>
      <div className="alert-div">
        {alert.type ? <div className={`walkable-alert ${alert.type}`}>
                        <div>
                          <div className="message-div">{alert.message}</div>
                          <div className="close-button-div"><button onClick={() => setAlert({type:'', message:''})}>x</button></div>
                        </div>
                      </div> : null}
      </div>
      {active ? <div className="button-div">
                  <button onClick={() => sendLocation()}><h1>I Want To Cross Here</h1></button>
                </div> : null}
    </div>
  );
}

export default App;
