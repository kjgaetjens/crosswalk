import React,{useState} from 'react';
import axios from 'axios'

function Register() {

  const [newUser, setNewUser] = useState({username:'', password:''})

  const handleUserInputChange = (e) => {
    setNewUser({
        ...newUser,
        [e.target.name]: e.target.value
    })
  }
  
  const createUser = () => {
    const username = newUser.username
    const password = newUser.password
    const user = {"username": username, "password": password}

    axios.post('http://localhost:3001/register', user)

  }


  return (
    <div>
      <label>Username: </label>
      <input name="username" type="text" onChange={(e) => handleUserInputChange(e)}/>
      <label>Password: </label>
      <input name="password" type="password" onChange={(e) => handleUserInputChange(e)}/>
      <button onClick={() => createUser()}>Submit</button>
    </div>
  );
}

export default Register;
