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
        })
    }

    return (
        <div>
            <input type="text" name="username" onChange={(e) => handleInputChange(e)} />
            <input type="password" name="password" onChange={(e) => handleInputChange(e)} />
            <button onClick={() => handleLogin()}>Login</button>
        </div>
    )

}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuthenticate: (token) => dispatch({type: 'ON_AUTHENTICATE', token: token})
    }
}

export default connect(null,mapDispatchToProps)(Login)