import {Link, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect} from "react";
import AuthService from "../services/AuthService";
import RouteService from "../services/RouteService";
import axios from "axios";

function SidebarItem(props) {
  //onClick={()=>props.changePage(props.page)}
  const isActive = useLocation().pathname == props.page.path;
  return (
    <Link className={isActive ?"sidebar-item active":"sidebar-item"} to={props.page.path}>{props.page.name}</Link>);
}

function SidebarGroup(props) {
  return (
    <div className="sidebar-group">
      <div className="sidebar-group-header">{props.name}</div>
      <div className="sidebar-group-content">{props.children}</div>
    </div>);
}

function Sidebar(props) {
  const allGroups = ['people', 'employees', 'messages','visas','visaApplications'];

  const pages = props.pages;
  const items = pages.map((page) =>
    <SidebarItem changePage={props.changePage} key={page.name} page={page}/>
  );

  // useEffect(()=>RouteService.getPages(), [])

  const hasGroup = (g) => {
    for(let p of props.pages) {
      // console.log('hasGroup', g, p.group);
      if(p.group == g) return true;
    }
    return false;
  }

  const ofGroup = (group) => {
    return props.pages.filter(e => e.group == group).map((page) =>
      <SidebarItem changePage={props.changePage} key={page.name} page={page}/>
    );
  }

  const groups = () => {
    return allGroups.filter(e => hasGroup(e))
      .map(group =>
      <SidebarGroup name={group} key={group}>
        {ofGroup(group)}
      </SidebarGroup>);
  }
  const navigate = useNavigate();
  const person = JSON.parse(localStorage.getItem('person'));
  return (
    <div className="sidebar">
      {groups()}
      <div className="sidebar-footer">
        <div>Ваш ID: {localStorage.getItem("employee")}</div>
        {person ? <div>{person.firstName} {person.lastName}</div> : ''}
        <div>{localStorage.getItem('dimension')}</div>
        <div style={{marginTop: "10px"}} className={'small-link'} onClick={() => {
          AuthService.logout().then((res)=> {
            navigate('/login');
          }
        );
        }}>Выйти</div>
      </div>
    </div>
  );
}

export default Sidebar;