import ListPage from "../ListPage";
import ResourceService from "../../services/ResourceService";
import {ActionPage} from "../ActionPage";
import {useEffect, useState} from "react";
import axios from "axios";

export default function ViolationChecksList(props) {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState();
  const [popupActive, setPopupActive] = useState(false);

  const handlePageChange = (page) =>
    ResourceService.getResourceRaw( 'violationChecks/search/findByEmployees_id',
      {employee: localStorage.getItem("employee")}
    ).then( res => {
        const items = res.data["_embedded"]['violationChecks']
          .filter(e => e.isFinished === false).map(e => ({
            id: e.id, application: e.visaApp
          })).sort((a,b)=>(a.excTime>b.excTime));
        return {items};
      }
    );

  const submitForm = (data) => {
    if(!currentItem) return new Promise(() => false);
    const body = {
    }

    return ResourceService.postResource(`visaApplications/finishCheck`, body)
      .then(res => {
        if(res.status === 201) {
          // console.log(res)
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
    <ListPage
      // key={update}
      getData={handlePageChange}
      itemClickHandler={setCurrentItem}
      addHandler={handleAdd}
      removeHandler={handleRemove}
    />

  const handlePopupSubmit = () => {
    setPopupActive(false);
    setUpdate(Date.now());
  }

  return (
    <ActionPage
      key={update}
      popup={<VisaChecksPopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>}
      popupStateHandler={{popupActive, setPopupActive}}
      displayedContent={<VisaCheckContent currentItem={currentItem}/>}
      list={list()}
      form={<VisaChecksForm onSubmit={submitForm}/>}/>
  );
}

function VisaCheckContent (props) {
  const [employees, setEmployees] = useState([])
  const [newEmployee, setNewEmployee] = useState();
  const contentSubmit = (event) => {
    event.preventDefault()
    if(!newEmployee) return;
    assignEmployee();
  }

  const loadEmployees = () => {
    ResourceService.getResourceRaw(`visaChecks/${props.currentItem.id}/employees`, {})
      .then(res => {
        if(res.status === 200) {
          console.log(res.data)
          const employees = res.data["_embedded"]['employees']
            .map(i => ({id: i.id, person: i.person}));
          setEmployees(employees.map(i => <div key={i.id}>{i.id}</div>));
        }
      });
  }

  const assignEmployee = () => {
    ResourceService.addSubResource(`visaChecks/${props.currentItem.id}/employees`, `employees/${newEmployee}`)
      .then(res => {
        console.log(res)
        loadEmployees();
      })
  }

  useEffect(()=>{
    if(props.currentItem)
      loadEmployees();
  }, [props.currentItem])

  if(props.currentItem) {
    return (
      <div className="msg-processing-message-container">
        <div className="msg-processing-message-header">
          Проверяющие заявку [{props.currentItem.id}]:
        </div>
        <form onSubmit={contentSubmit}>
          <input type={"number"} required onChange={event=>{setNewEmployee(event.target.value)}}/>
          <input type={"submit"} value={"Добавить проверяющего"}/>
        </form>
        <div className="msg-processing-message-wrapper">
          <div className="msg-processing-message">
            {employees}
          </div>
        </div>
      </div>
    );
  }
  else return (<div>Выберите заявку из списка</div>);
}

function VisaChecksPopup(props) {
  const [currentItem, setCurrentItem] = useState();

  const loadData = () => {
    return ResourceService.getResourceRaw( 'visaApplications/search/findByVisaAppState',
      {state: "awaits_review"}
    ).then( res => {
        const items = res.data["_embedded"]['visaApplications']
          .map(i => ({
            id: i.id, person: i.person, applicationDate: i.applicationDate, startDate: i.startDate, expDate: i.expDate, trans: i.trans
          }));
        return {items};
      }
    );
  }

  const submit = () => {
    if(!currentItem) return;
    ResourceService.postResource(`visaApplications/createCheck`,
      {employee: localStorage.getItem("employee"), app_id: currentItem.id}
    ).then(res => {
      if(res.status === 201) {
        props.onSubmit();
        // props.stateHandler(false);
      }
    });
  }

  return (
    <div className="messages-popup-container">
      <div className="messages-popup-list-wrapper">
        <ListPage
          // key={update}
          getData={loadData}
          itemClickHandler={setCurrentItem}
        />
      </div>
      <div>
        <button onClick={submit}>Ok</button>
      </div>
    </div>
  );
}

function VisaChecksForm(props) {
  const [state, setState] = useState({});
  const handleChange = (event) => {
    // console.log(event)
    state[event.target.name] = event.target.value;
    setState({...state});
  }

  const onSubmit = (event) => {
    // event.preventDefault();
    // if(!state.verdict) return;
    // console.log(state)
    // ResourceService.postResource(`visaApplications/finishCheck`,
    //   {id: currentItem.id}
    // ).then(res => {
    //   if(res.status === 201) {
    //     props.onSubmit();
    //     // props.stateHandler(false);
    //   }
    // });
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <span>Вердикт: </span>
        <select name="verdict" onChange={handleChange} defaultValue={"DISABLED"} required>
          <option disabled value={"DISABLED"}>---</option>
          <option value={"granted"}>Одобрено</option>
          <option value={"not_granted"}>Не одобрено</option>
        </select>
      </div>
      <div>Комментарий к заявке:</div>
      <div>
            <textarea className="msg-processing-result-textarea"
                      name="comment"
                      onChange={handleChange}/>
      </div>
      <input type="submit" value="Отправить" />
    </form>
  );
}