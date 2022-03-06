import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom"

// import {createBrowserHistory} from 'history'

import './styles/index.css';
import App from './App';

// const history = createBrowserHistory()

ReactDOM.render((
    <Router>
      <App/>
    </Router>
  ),document.getElementById('root')
);
