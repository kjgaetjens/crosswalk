import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import './index.css';
// import App from './App';
import AddSession from './components/AddSession'
// import Sessions from './components/Sessions'
import Session from './components/Session'
import Dashboard from './components/Dashboard'
import * as serviceWorker from './serviceWorker';
import Login from './components/Login'
import {BaseLayout} from './BaseLayout'
import { setAuthenticationHeader } from './utils/authenticate'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducer from './store/reducer'
import requireAuth from './components/requireAuth'

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

let token = localStorage.getItem('jsonwebtoken')
setAuthenticationHeader(token)

ReactDOM.render(
    <BrowserRouter>
    <Provider store = {store}>
        <BaseLayout>
            <Switch>
                <Route path="/login" component={Login} />
                {/* <Route exact path="/sessions" component={requireAuth(Sessions)} /> */}
                <Route path="/sessions/add-session" component={requireAuth(AddSession)} />
                <Route exact path="/sessions/:sessionid" component={requireAuth(Session)} />
                <Route path="/sessions/:sessionid/dashboard" component={requireAuth(Dashboard)} />
            </Switch>
        </BaseLayout>
    </Provider>
    </BrowserRouter>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
