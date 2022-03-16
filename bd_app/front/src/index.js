import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router} from "react-router-dom"

// import {createBrowserHistory} from 'history'
import './styles/index.css';
import App from './App';
import {setAppElement} from "react-modal";

// var BACKEND_API_PORT_NUMBER = 8081;
// const history = createBrowserHistory()

ReactDOM.render((
    <Router>
      <App/>
    </Router>
  ),document.getElementById('root')
);
setAppElement(document.getElementById('root'));
