import ListPage from "../ListPage";
import ResourceService from "../../services/ResourceService";
import {ActionPage} from "../ActionPage";
import {useState} from "react";

export default function ApplicationsList() {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState(Date.now());
  const [popupActive, setPopupActive] = useState(false);

  const handlePageChange = (page) => (
    ResourceService.getResource( 'visaApplications',
      {page: page, size: 20}
    ))

  const handleItemClick = (item) => {setCurrentItem(item)}
  const handleAdd = () => {setPopupActive(true)}

  const handleRemove = () => {

  }


  const list = () => <ListPage
    getData={handlePageChange}
    addHandler={handleAdd}
    itemClickHandler={handleItemClick}
    removeHandler={handleRemove}
  />

  const handlePopupSubmit = () => {
    setPopupActive(false);
    setUpdate(Date.now())
  }

  return (
    <ActionPage
      key={update}
      list={list()}
      popup={<NewApplicationPopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>}
      popupStateHandler={{popupActive, setPopupActive}}
    />

  );
}

function NewApplicationPopup(props) {
  const [state, setState] = useState({});

  const today = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    return String(yyyy + '-' + mm + '-' + dd);
  }

  const submit = (event) => {
    event.preventDefault()
    // console.log(state);

    if(state.end < state.start) return;
    const body = {
      person: state.id,
      applicationDate: today(),
      startDate: state.start,
      expDate: state.end,
      trans: state.trans,
      visaAppState: 'awaits_review'
    }
    ResourceService.postResource('visaApplications', body)
      .then(res => {
        if(res.status === 201) {
          console.log(res);
          props.onSubmit();
        }
      });
  }

  const handleChange = (event) => {
    state[event.target.name] = event.target.value;
    setState({...state})
  }
  
  return (
    <form onSubmit={submit}>
      <div>ID человека:<input type={"text"} name={"id"} onChange={handleChange} required/></div>
      <div>Дата начала действия визы:<input type={"date"} name={"start"} onChange={handleChange} required/></div>
      <div>Дата окончания действия визы:<input type={"date"} name={"end"} onChange={handleChange} required/></div>
      <div>Количество переходов:<input type={"number"} name={"trans"} onChange={handleChange} required/></div>
      <div><input type={"submit"} value={"Подтвердить"}/></div>
    </form>
  );
}