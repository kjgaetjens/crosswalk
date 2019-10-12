import React from 'react';
import Menu from './components/Menu'

export function BaseLayout(props) {

    return (
        <div>
            <Menu />
            {props.children}
            {/* <Footer /> */}
        </div>
    ) 

}