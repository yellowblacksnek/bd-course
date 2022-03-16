import '../../styles/NewEmployee.css'

import ListPage from "../list/ListPage";
import ResourceService from "../../services/ResourceService";
import {useEffect, useRef, useState} from "react";
import {ActionPage} from "../ActionPage";
import {today} from "../Utils";
import EmployeesService from "../../services/EmployeesService";
import PeopleService from "../../services/PeopleService";
import toast, {resolveValue} from "react-hot-toast";
import Modal from "react-modal";
import NewEmployeePopup from "./NewEmployeePopup";
import EditEmployeePopup from "./EditEmployeePopup";

export default function EmployeeList() {
  const [update, setUpdate] = useState();
  const [currentItem, setCurrentItem] = useState('')
  const [addPopupActive, setAddPopupActive] = useState(false);
  const [editPopupActive, setEditPopupActive] = useState(false);

  // const handlePageChange = (page,sort) => (EmployeesService.getAllEmployees(page,sort))
  const addSubmit = () => {setAddPopupActive(false);setUpdate(Date.now());}
  const editSubmit = () => {setEditPopupActive(false);setUpdate(Date.now());}

  const list = () =>
    <div style={{height: "100%"}}>
      <Modal
        isOpen={addPopupActive}
        onRequestClose={()=>{setAddPopupActive(false)}}
        className={'popup'}
        overlayClassName={'popup-container'}
      >
        <NewEmployeePopup stateHandler={setAddPopupActive} onSubmit={addSubmit}/>
      </Modal>
      <Modal
        isOpen={editPopupActive}
        onRequestClose={()=>{setEditPopupActive(false)}}
        className={'popup'}
        overlayClassName={'popup-container'}
      >
        <EditEmployeePopup item={currentItem} stateHandler={setEditPopupActive} onSubmit={editSubmit}/>
      </Modal>
      <ListPage
        // nameMap={{personId: 'person'}}
        notSortable={["departments"]}
        getData={EmployeesService.getAllEmployees}

        addHandler={()=>setAddPopupActive(true)}
        editHandler={()=>{if(currentItem)setEditPopupActive(true)}}
        itemClickHandler={setCurrentItem}/>
    </div>
  return (
    <ActionPage
      key={update}
      list={list()}/>

  );
}