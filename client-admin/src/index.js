import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import './index.css';
import App from './App';
import AddSession from './components/AddSession'
import Sessions from './components/Sessions'
import Session from './components/Session'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <BrowserRouter>
        <Route path="/add-session" component={AddSession} />
        {/* will have to add exact here */}
        {/* <Route path="/sessions" component={Sessions} /> */}
        <Route path="/sessions/:sessionid" component={Session} />
    </BrowserRouter>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
