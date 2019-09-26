import React,{useState} from 'react';
import axios from 'axios'

function AddSession() {

  const [newSession, setSession] = useState({session:''})

  const handleSessionInputChange = (e) => {
    setSession({session: e.target.value})
  }
  
  const createSession = () => {
    const param = newSession.session
    const status = 'INACTIVE'
    const session = {"param": param, "status": status}

    axios.post('http://localhost:3001/sessions/add-session', session)

    // fetch(`http://localhost:3001/add-session`, {
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify(session)
    // })
  }


  return (
    <div>
      <label>Desired Session Name: </label>
      <input name="session" type="text" onChange={(e) => handleSessionInputChange(e)}/>
      <button onClick={() => createSession()}>Submit</button>
    </div>
  );
}

export default AddSession;
