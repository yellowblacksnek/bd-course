import '../styles/Main.css';
import '../styles/Sidebar.css';

import React, {useState} from "react";

import ListPage from "./ListPage";
import AuthService from "../services/AuthService";
import {Link, Route, Routes} from "react-router-dom";
import RouteService from "../services/RouteService";
import Sidebar from "./Sidebar";
import DecryptMessages from "./messages/DecryptMessages";
import EncryptMessages from "./messages/EncryptMessages";
import PeopleList from "./people/PeopleList";
import EmployeeList from "./people/EmployeeList";
import Exchange from "./messages/Exchange";
import MessagesList from "./messages/MessagesList";
import VisasList from "./visas/VisasList";
import ApplicationsList from "./visas/ApplicationsList";
import VisaChecksList from "./visas/VisaChecksList";
import ViolationsList from "./visas/ViolationsList";
import ViolationChecksList from "./visas/ViolationChecksList";


function Main(props) {
  const [pages, setPages] = useState(RouteService.allPages)
  const [curPage, setCurPage] = useState({name:'none',group:'none', path:'/'});

  React.useEffect(() => {
    AuthService.login('user', 'password');
    // return () => {
    //   AuthService.logout();
    // }
  }, []);


  return (
    <div className="main-container">
      <div className="main-header">
          aboba {curPage.name}
      </div>
      <div className="main-content-container">
          <Sidebar changePage={setCurPage} pages={pages}/>
        <div className="main-content-wrapper">
          <Routes>
            <Route path='/people' element={<PeopleList />}/>
            <Route path='/employees' element={<EmployeeList/>}/>
            <Route path='/messages' element={<MessagesList/>}/>
            <Route path='/messages/decrypt' element={<DecryptMessages/>}/>
            <Route path='/messages/encrypt' element={<EncryptMessages/>}/>
            <Route path='/messages/exchange' element={<Exchange/>}/>
            <Route path='/visas' element={<VisasList/>}/>
            <Route path='/visas/applications' element={<ApplicationsList/>}/>
            <Route path='/visas/applications/check' element={<VisaChecksList/>}/>
            <Route path='/violations' element={<ViolationsList/>}/>
            <Route path='/violations/check' element={<ViolationChecksList/>}/>

          </Routes>
        </div>
      </div>
      {/*<Home/>*/}
    </div>
  );
}

export default Main;