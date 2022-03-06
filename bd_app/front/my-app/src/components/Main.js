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
import PeopleList from "./PeopleList";
import EmployeeList from "./EmployeeList";
import Exchange from "./messages/Exchange";


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
            <Route path='/messages' element={<ListPage name={'messages'}/>}/>
            <Route path='/messages/decrypt' element={<DecryptMessages/>}/>
            <Route path='/messages/encrypt' element={<EncryptMessages/>}/>
            <Route path='/messages/exchange' element={<Exchange/>}/>
            <Route path='/visas' element={<ListPage name={'visas'}/>}/>
            <Route path='/visas/applications' element={<ListPage name={'visaApplications'}/>}/>
          </Routes>
        </div>
      </div>
      {/*<Home/>*/}
    </div>
  );
}

export default Main;