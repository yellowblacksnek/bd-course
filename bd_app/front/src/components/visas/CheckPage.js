import '../../styles/ChecksPages.css'

import ListPage from "../list/ListPage";
import ResourceService from "../../services/ResourceService";
import {ActionPage} from "../ActionPage";
import React, {useEffect, useState} from "react";
import Modal from 'react-modal';
import toast from "react-hot-toast";
import AddEmployeeToCheckPopup from "./AddEmployeeToCheckPopup";
import VisaChecksService from "../../services/VisaChecksService";

export default function CheckPage({loadChecks, loadCheckItem, checkItem, checkForm, ...props}) {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState();
  const [popupActive, setPopupActive] = useState(false);

  const submitForm = (data) => {
    if(!currentItem) return new Promise(() => false);
    const body = {
      id:currentItem.id,
      verdict:data.verdict,
      comment: data.comment || ' '
    }

    return ResourceService.postResource(`visaApplications/finishCheck`, body)
      .then(res => {
        if(res.status === 200) {
          console.log(res)
          setCurrentItem();
          setUpdate(Date.now());
        }
      });
  }

  const handleAdd = () => {
    setPopupActive(true);
  }

  const handleRemove = () => {
    if(!currentItem) return;
    const body = {
      id: currentItem.id
    }
    ResourceService.postResource(`visaApplications/deleteCheck`, body)
      .then(res => {
        if(res.status === 204) {
          setCurrentItem();
          setUpdate(Date.now());
        }
      });
  }

  const list = () =>
    <div style={{height: "100%"}}>
      <Modal
        isOpen={popupActive}
        onRequestClose={()=>{setPopupActive(false)}}
        className={'popup'}
        overlayClassName={'popup-container'}
      >
        <VisaChecksPopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>
      </Modal>
      <ListPage
        // key={update}
        notSortable={["id", "application"]}
        noSearch={{}}
        nameMap={{id: "ID проверки", application: "ID объекта"}}
        getData={loadChecks}
        itemClickHandler={setCurrentItem}
        addHandler={handleAdd}
        removeHandler={handleRemove}
      />
    </div>
  const handlePopupSubmit = () => {
    setPopupActive(false);
    setUpdate(Date.now());
  }

  return (
    <ActionPage
      key={update}
      // popup={<VisaChecksPopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>}
      // popupStateHandler={{popupActive, setPopupActive}}
      displayedContent={<CheckPageContent currentItem={currentItem} checksName={checksName}/>}
      list={list()}
      form={checkForm}/>
  );
}

function CheckPageContent ({currentItem, loadItem, checkResourceName, department, itemComponent, ...props}) {
  const [application, setApplication] = useState();
  const [employees, setEmployees] = useState([])
  const [newEmployee, setNewEmployee] = useState();

  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {setIsOpen(true);}
  function closeModal() {setIsOpen(false);}

  const loadEmployees = ()=>VisaChecksService.loadEmployeesDivs(currentItem.id).then(res=>setEmployees(res));

  useEffect(()=>{
    if(currentItem) {
      loadEmployees();
      loadItem();
    }
  }, [currentItem])

  if(currentItem) {
    return (
      <div className="check-content-container">
        <div className="check-content-header">
          {/*<form className="check-employee-form" onSubmit={contentSubmit}>*/}
          {/*  <input type={"number"} required onChange={event=>{setNewEmployee(event.target.value)}}/>*/}
          {/*</form>*/}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={()=>{setIsOpen(false)}}
            className={'popup'}
            overlayClassName={'popup-container'}
          >
            <AddEmployeeToCheckPopup checkResourceName={checkResourceName} department={department} check={currentItem} stateHandler={setIsOpen} onSubmit={loadEmployees}/>
          </Modal>
          <div className="check-content-header-title">
            <div>Проверяющие заявление [{currentItem.id}]:</div>
            <button className="auth-form-button small-size" onClick={openModal}> + </button>
          </div>
          <div className="check-employees">
            {employees}
          </div>
        </div>
        { application && React.cloneElement(itemComponent, {item: currentItem})

        }
      </div>
    );
  }
  else return (<div>Выберите заявку из списка</div>);
}

function VisaCheckItem({item}) {
  return (
    <div className="check-data">
      <div>ID заявления: {item.id}</div>
      <div>ID человека: {item.person.id}</div>
      <div>Человек: {item.person.firstName + ' ' + item.person.lastName}</div>
      <div>Дата начала: {item.startDate}</div>
      <div>Дата конца: {item.expDate}</div>
      <div>Количество переходов: {item.trans}</div>
      <div>Дата подачи: {item.applicationDate}</div>
    </div>
  );
}

function ChecksPopup({loadPopupData, submitCheck, ...props}) {
  const [currentItem, setCurrentItem] = useState();

  const loadData = (page,sort,search) => {
    return ResourceService.getResourceSearch( 'visaApplications',
      {...search, visaAppState: "awaits_review"}, {page,sort}
    ).then( res => {
        res.items = res.items
          .map(i => ({
            id: i.id, person: `[${i.person.id}] ${i.person.firstName} ${i.person.lastName}`, applicationDate: i.applicationDate, startDate: i.startDate, expDate: i.expDate, trans: i.trans
          }));
        return res;
      }
    );
  }

  const submit = () => {
    if(!currentItem) return;
    ResourceService.postResource(`visaApplications/createCheck`,
      {employee: localStorage.getItem("employee"), app_id: currentItem.id}
    ).then(res => {
      toast.success("Проверка создана!");
      props.onSubmit();
    });
  }

  return (
    <div className="list-popup" style={{minWidth: "800px"}}>
      <div className="messages-popup-list-wrapper">
        <ListPage
          // key={update}
          columnWidths={{person: 200}}
          getData={loadPopupData}
          itemClickHandler={setCurrentItem}
        />
      </div>
      <div>
        <button className={"auth-form-button fixed-size"} onClick={submit}>Ok</button>
      </div>
    </div>
  );
}