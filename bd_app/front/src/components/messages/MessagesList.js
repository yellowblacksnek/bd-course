import '../../styles/Form.css'

import ResourceService from "../../services/ResourceService";
import ListPage from "../list/ListPage";
import {ActionPage} from "../ActionPage";
import {useEffect, useState} from "react";
import {today} from "../Utils";
import MessagesService from "../../services/MessagesService";
import PeopleService from "../../services/PeopleService";
import toast, {Toaster} from "react-hot-toast";
import Modal from "react-modal";

export default function MessagesList() {
  const [update, setUpdate] = useState();
  const [popupActive, setPopupActive] = useState(false);

  const handlePopupSubmit = () => {setPopupActive(false);setUpdate(Date.now());}

  const list = () =>
    <div style={{height: "100%"}}>
      <Modal
        isOpen={popupActive}
        onRequestClose={()=>{setPopupActive(false)}}
        className={'popup'}
        overlayClassName={'popup-container'}
      >
        <NewMessagePopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>
      </Modal>
      <ListPage
        getData={MessagesService.getAllMessages}
        addHandler={()=>setPopupActive(true)}/>
    </div>
  return (
      <ActionPage
      key={update}
      // popup={<NewMessagePopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>}
      // popupStateHandler={{popupActive, setPopupActive}}
      list={list()}/>
  );
}

function NewMessagePopup(props) {
  const [state, setState] = useState({});
  const [current, setCurrent] = useState('')
  const thisDim = localStorage.getItem('dimension');
  const otherDim = thisDim === 'alpha' ? 'prime' : 'alpha';

  const submit = (event) => {
    event.preventDefault()
    if(!state.content || state.content.trim().length < 1) {
      toast.error("Нет сообщения!");
      return;
    }

    if(state.end < state.start) return;
    const body = {
      content: state.content,
      sender: state.sender,
      recipient: state.recipient
    }
    MessagesService.postMessage(body).then((res) => {
      toast.success(`Сообщение создано! [ID: ${res.id}]`)
      props.onSubmit()
    });
  }

  const handleChange = (event) => {
    state[event.target.name] = event.target.value;
    setState({...state})
  }

  const handleClick = (event) => {
    setCurrent(event.target.name);
  }

  useEffect(() => {
    if(!state.person) return;
    if(current === 'sender') {setState({...state, sender: state.person.id})}
    else {setState({...state, recipient: state.person.id})}

    console.log(state)
  }, [state.person])

  return (
    <div className="new-message-popup">
      <div>
        <div className="popup-form-title">Новое сообщение</div>
        <form className="popup-form" onSubmit={submit}>
          <div className="form-field">ID отправителя:<input type={"number"} name={"sender"} onClick={handleClick} value={state.sender || ''} readOnly required/></div>
          <div className="form-field">ID получателя:<input type={"number"} name={"recipient"} onClick={handleClick} value={state.recipient || ''} readOnly required/></div>
          <div>Содержание:</div>
          <textarea  className="form-textarea" name={"content"} onChange={handleChange} required/>
          <input className="form-submit" type={"submit"} value={"Подтвердить"}/>
        </form>
      </div>
      {/*<div>*/}
        <div className="person-select new-message-person-select" id="person-picker">
          {<ListPage
            key={current}
            getData={(page,sort,search)=>{
              if(current) {
                return PeopleService.getAllPeople(page, sort, {...search,currentDim: (current === 'sender' ? thisDim : otherDim), knows:true }).then(res => {
                  res.items = res.items.map(i => ({id: i.id, firstName: i.firstName, lastName: i.lastName}))
                  return res;
                })
              } else return new Promise(()=>false);
            }}
            itemClickHandler={item=>setState({...state, person: item})}/>}
        </div>
      {/*</div>*/}
    </div>
  );
}