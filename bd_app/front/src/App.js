import './styles/App.css';
import Main from "./components/Main";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import React from "react";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<RegisterPage />}/>
        <Route path='*' element={<Main />}/>
      </Routes>
    </div>
  );
}

export default App;
