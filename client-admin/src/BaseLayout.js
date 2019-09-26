import React from 'react';
import Menu from './components/Menu'
import Footer from './components/Footer'

export function BaseLayout(props) {

    return (
        <div>
            <Menu />
            {props.children}
            {/* <Footer /> */}
        </div>
    ) 

}