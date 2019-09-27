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
      <div className="login">
        <h1>Register for Walkable</h1>
        <div className="form-group">
          <label htmlFor="username">Email address</label>
          <input id="username" name="username" type="email" className="form-control" placeholder="eg. myemail@domain.com" onChange={(e) => handleUserInputChange(e)}/>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className="form-control" placeholder="eg. abCD12!!" onChange={(e) => handleUserInputChange(e)}/>
        </div>
        <button className="btn btn-primary" onClick={() => createUser()}>Submit</button>
      </div>
  );
}

export default Register;
