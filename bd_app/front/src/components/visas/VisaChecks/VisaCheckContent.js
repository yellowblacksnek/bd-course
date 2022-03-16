import {useEffect, useState} from "react";
import VisaChecksService from "../../../services/VisaChecksService";
import Modal from "react-modal";
import AddEmployeeToCheckPopup from "../AddEmployeeToCheckPopup";

export default function VisaCheckContent (props) {
  const [application, setApplication] = useState();
  const [employees, setEmployees] = useState([])
  const [newEmployee, setNewEmployee] = useState();

  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {setIsOpen(true);}
  function closeModal() {setIsOpen(false);}

  const loadEmployees = ()=>VisaChecksService.loadEmployeesDivs(props.currentItem.id).then(res=>setEmployees(res));
  const loadApplication = ()=>VisaChecksService.loadApplication(props.currentItem.id).then(res=>setApplication(res));

  useEffect(()=>{
    if(props.currentItem) {
      loadEmployees();
      loadApplication();
    }
  }, [props.currentItem])

  if(props.currentItem) {
    return (
      <div className="check-content-container">
        <div className="check-content-header">
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={()=>{setIsOpen(false)}}
            className={'popup'}
            overlayClassName={'popup-container'}
          >
            <AddEmployeeToCheckPopup checkResourceName={"visaChecks"} department={"customs"} check={props.currentItem} stateHandler={setIsOpen} onSubmit={loadEmployees}/>
          </Modal>
          <div className="check-content-header-title">
            <div>Проверяющие заявление [{props.currentItem.id}]:</div>
            <button className="auth-form-button small-size" onClick={openModal}> + </button>
          </div>
          <div className="check-employees">
            {employees}
          </div>
        </div>
        { application && <VisaCheckItem item={application}/>

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