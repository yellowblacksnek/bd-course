import '../../../styles/ChecksPages.css'

import ListPage from "../../list/ListPage";
import ResourceService from "../../../services/ResourceService";
import {ActionPage} from "../../ActionPage";
import {useEffect, useState} from "react";
import {today} from "../../Utils";
import Popup from "../../Popup";
import Modal from "react-modal";
import AddEmployeeToCheckPopup from "../AddEmployeeToCheckPopup";
import CheckPopup from "../CheckPopup";
import VisaChecksService from "../../../services/VisaChecksService";
import ViolationChecksService from "../../../services/ViolationChecksService";
import toast from "react-hot-toast";

export default function ViolationChecksList(props) {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState();
  const [popupActive, setPopupActive] = useState(false);

  const submitForm = (data) => {
    if(!currentItem) return new Promise(() => false);
    const body = {
      id:currentItem.id,
      verdict:data.verdict,
      restriction: data.restriction || today(),
      comment:data.comment || ' '
    }

    return ViolationChecksService.finishCheck(body)
      .then(res => {
        setCurrentItem();
        setUpdate(Date.now());
      });
  }

  const handleRemove = () => {
    if(!currentItem) return;
    const body = {
      id: currentItem.id
    }
    ViolationChecksService.deleteCheck(currentItem.id)
      .then(res => {
        setCurrentItem();
        setUpdate(Date.now());
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
        <CheckPopup stateHandler={setPopupActive}
                    onSubmit={handlePopupSubmit}
                    createCheck={ViolationChecksService.createCheck}
                    loadItems={ViolationChecksService.loadViolations}
        />

      </Modal>
      <ListPage
        // key={update}
        notSortable={["id", "violation"]}
        noSearch={true}
        nameMap={{id: "ID проверки", violation: "ID нарушения"}}
        getData={ViolationChecksService.loadViolationChecks}
        itemClickHandler={setCurrentItem}
        addHandler={()=>setPopupActive(true)}
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
      displayedContent={<ViolationChecksContent currentItem={currentItem}/>}
      list={list()}
      form={<ViolationChecksForm onSubmit={submitForm}/>}/>
  );
}

function ViolationChecksContent (props) {
  const [violation, setViolation] = useState();
  const [employees, setEmployees] = useState([])
  const [newEmployee, setNewEmployee] = useState();

  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {setIsOpen(true);}
  function closeModal() {setIsOpen(false);}

  const loadEmployees = ()=>ViolationChecksService.loadEmployeesDivs(props.currentItem.id).then(res=>setEmployees(res));
  const loadViolation = ()=>ViolationChecksService.loadViolation(props.currentItem.id).then(res=>setViolation(res));

  useEffect(() => {
    if (props.currentItem) {
      loadEmployees();
      loadViolation();
    }
  }, [props.currentItem])

  if (props.currentItem) {
    return (
      <div className="check-content-container">
        <div className="check-content-header">
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => {setIsOpen(false)}}
            className={'popup'}
            overlayClassName={'popup-container'}
          >
            <AddEmployeeToCheckPopup checkResourceName={"violationChecks"} department={"operations"}
                                     check={props.currentItem} stateHandler={setIsOpen} onSubmit={loadEmployees}/>
          </Modal>
          <div className="check-content-header-title">
            <div>Проверяющие нарушение [{props.currentItem.id}]:</div>
            <button className="auth-form-button small-size" onClick={openModal}> +</button>
          </div>
          <div className="check-employees">
            {employees}
          </div>
        </div>
        {violation &&
          <ViolationCheckItem item={violation}/>
        }
      </div>
    );
  } else return (<div>Выберите заявку из списка</div>);
}

function ViolationCheckItem({item}) {
  return (
    <div className="check-data">
      <div>ID нарушения: {item.id}</div>
      <div>ID человека: {item.person.id}</div>
      <div>Тип нарушения: {item.violationType}</div>
      <div>Описание:</div>
      <div className="check-data-text">{item.description}</div>
      <div>Дата: {item.issueDate}</div>
    </div>
  );
}

function ViolationChecksForm(props) {
  const [state, setState] = useState({});
  const handleChange = (event) => {
    // console.log(event)
    state[event.target.name] = event.target.value;
    setState({...state});
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if(!state.verdict) return;
    console.log(state)
    props.onSubmit(state).then(res => {
      setState({});
      toast.success("Проверка закончена!")
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <span>Вердикт: </span>
        <select name="verdict" onChange={handleChange} defaultValue={"DISABLED"} required>
          <option disabled value={"DISABLED"}>---</option>
          <option value={"restriction"}>Ограничение</option>
          <option value={"warning"}>Предупреждение</option>
          <option value={"no_action"}>Бездействие</option>
        </select>
      </div>
      <div>
        <span>Ограничить до: </span>
        <input type="date" name="restriction" disabled={state.verdict !== 'restriction'} min={today()} onChange={handleChange}/>
      </div>
      <div>Комментарий к решению:</div>
      <div>
            <textarea className="msg-processing-result-textarea"
                      name="comment"
                      onChange={handleChange}/>
      </div>
      <input type="submit" value="Отправить" />
    </form>
  );
}