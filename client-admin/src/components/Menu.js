import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

function Menu(props) {

    const handleSignout = () => {
        localStorage.removeItem('jsonwebtoken')
        props.onSignout()
    }

    return (
        <nav className="navbar">
        {/* <nav className="navbar navbar-dark bg-primary"> */}
            <span className="navbar-brand mb-0 h1">{props.authenticated ? <NavLink to="/sessions">Walkable</NavLink> : <NavLink to="/">Walkable</NavLink>}</span>
            <span>
            {props.authenticated ? <NavLink to="/sessions">Sessions</NavLink> : null}
            {!props.authenticated ? <NavLink to="/register">Register</NavLink> : null}
            {!props.authenticated ? <NavLink to="/">Login</NavLink> : null}
            {props.authenticated ? <a href="/" onClick={() => handleSignout()}>Sign Out</a>: null}
            </span>
        </nav>
    )

}


const mapStateToProps = (state) => {
 return {
     authenticated: state.isAuthenticated
 }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSignout: () => dispatch({type: 'SIGN_OUT'})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)