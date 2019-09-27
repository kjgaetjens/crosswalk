import React, {useState} from 'react'
import axios from 'axios'
import {setAuthenticationHeader} from '../utils/authenticate'
import { connect } from 'react-redux'

function Login(props) {

    const [user, setUser] = useState({username: '', password:''})

    const handleInputChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleLogin = () => {
        axios.post('http://localhost:3001/login', {
            username: user.username,
            password: user.password
        }).then(response => {
            const token = response.data.token
            localStorage.setItem('jsonwebtoken',token)
            setAuthenticationHeader(token)
            props.onAuthenticate(token)
            props.history.push(`/sessions`)
        })

    }

    return (
        <div className="login">
            <h1>Log in to Walkable</h1>
            <div className="form-group">
                <label htmlFor="username">Email address</label>
                <input id="username" type="email" className="form-control" placeholder="eg. myemail@domain.com" name="username" onChange={(e) => handleInputChange(e)} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" className="form-control" placeholder="eg. abCD12!!" name="password" onChange={(e) => handleInputChange(e)} />
            </div>
            <button className="btn btn-primary" onClick={() => handleLogin()}>Login</button>
        </div>
    )

}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuthenticate: (token) => dispatch({type: 'ON_AUTHENTICATE', token: token})
    }
}

export default connect(null,mapDispatchToProps)(Login)