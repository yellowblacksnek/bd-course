import {Link, useLocation} from "react-router-dom";
import React from "react";

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
  console.log(props)
  const allGroups = ['people', 'employees', 'messages','visas','visaApplications'];

  const pages = props.pages;
  const items = pages.map((page) =>
    <SidebarItem changePage={props.changePage} key={page.name} page={page}/>
  );

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
    return allGroups.filter(e => {
      // console.log(e, hasGroup(e));
      return hasGroup(e);
    }).map(group =>
      <SidebarGroup name={group} key={group}>
        {ofGroup(group)}
      </SidebarGroup>);
  }

  return (
    <div className="sidebar">
      {groups()}
    </div>
  );
}

export default Sidebar;