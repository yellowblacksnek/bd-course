import '../styles/Main.css';
import '../styles/Sidebar.css';

import React, {useState} from "react";

import ListPage from "./list/ListPage";
import AuthService from "../services/AuthService";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import RouteService from "../services/RouteService";
import Sidebar from "./Sidebar";
import DecryptMessages from "./messages/DecryptMessages/DecryptMessages";
import EncryptMessages from "./messages/EncryptMessages/EncryptMessages";
import PeopleList from "./people/PeopleList";
import EmployeeList from "./employees/EmployeeList";
import Exchange from "./messages/Exchanges/Exchange";
import MessagesList from "./messages/MessagesList";
import VisasList from "./visas/VisasList/VisasList";
import ApplicationsList from "./visas/ApplicationsList/ApplicationsList";
import VisaChecksList from "./visas/VisaChecks/VisaChecksList";
import ViolationsList from "./visas/ViolationsList";
import ViolationChecksList from "./visas/ViolationChecks/ViolationChecksList";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import authHeader from "../services/AuthHeader";
import {Toaster} from "react-hot-toast";
import AllVisaChecksList from "./visas/VisaChecks/AllVisaChecksList";
import AllViolationChecksList from "./visas/ViolationChecks/AllViolationChecksList";


function Main(props) {
  const [pages, setPages] = useState(RouteService.getPages())
  const [curPage, setCurPage] = useState({name:'none',group:'none', path:'/'});

  const navigate = useNavigate();
  React.useEffect(() => {
    if(!authHeader().username) navigate('/login');
  }, []);


  return (
    <div className="main-container">
      {/*<div className="main-header">*/}
      {/*  <div>aboba {curPage.name}</div>*/}
      {/*  <div>{authHeader().username}</div>*/}
      {/*  <div>{localStorage.getItem('employee')}</div>*/}
      {/*  <div><button>Logout</button></div>*/}

      {/*</div>*/}
      <div className="main-content-container">
          <Sidebar changePage={setCurPage} pages={pages}/>
        <div className="main-content-wrapper">
          <Toaster
            toastOptions={{
              duration: 3000,
              success: {style: {background: 'green', color: 'white'},},
              error: {style: {background: 'red',},},
            }}
          />
          <Routes>
            {/*<Route path='/login' element={<LoginPage />}/>*/}
            {/*<Route path='/register' element={<RegisterPage />}/>*/}
            <Route path='/people' element={<PeopleList />}/>
            <Route path='/employees' element={<EmployeeList/>}/>
            <Route path='/messages' element={<MessagesList/>}/>
            <Route path='/messages/decrypt' element={<DecryptMessages/>}/>
            <Route path='/messages/encrypt' element={<EncryptMessages/>}/>
            <Route path='/messages/exchange' element={<Exchange/>}/>
            <Route path='/visas' element={<VisasList/>}/>
            <Route path='/visas/applications' element={<ApplicationsList/>}/>
            <Route path='/visas/applications/checks_list' element={<AllVisaChecksList/>}/>
            <Route path='/visas/applications/check' element={<VisaChecksList/>}/>
            <Route path='/violations' element={<ViolationsList/>}/>
            <Route path='/violations/checks_list' element={<AllViolationChecksList/>}/>
            <Route path='/violations/check' element={<ViolationChecksList/>}/>

          </Routes>
        </div>
      </div>
      {/*<Home/>*/}
    </div>
  );
}

export default Main;