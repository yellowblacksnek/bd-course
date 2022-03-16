import {useState} from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import PeopleService from "../../../services/PeopleService";
import DecryptionPopup from "./DecryptionPopup";

export default function DecryptionForm(props) {
  const [state, setState] = useState({});
  const [popupActive, setPopupActive] = useState(false);
  const [currentField, setCurrentField] = useState('');

  const handleChange = (event) => {
    console.log(event)
    setState({...state, [event.target.name]: event.target.value});
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if(!state.content || state.content.trim().length < 1) {
      toast.error("Нет сообщения!");
      return;
    }
    if(state.sender === state.recipient) {
      toast.error("Получатель и отправитель - одно лицо!");
      return;
    }
    props.onSubmit(state).then(res => {
      toast.success("Сообщение расшифровано!");
      setState({});
    });
  }

  const handlePopupSubmit = (item) => {
    if(!item) return;
    if(currentField === 'sender') setState({...state, sender: item.id})
    if(currentField === 'recipient') setState({...state, recipient: item.id})
    setPopupActive(false);
  }

  return (
    <div>
      <Modal
        isOpen={popupActive}
        onRequestClose={()=>{setPopupActive(false)}}
        className={'popup'}
        overlayClassName={'popup-container'}
      >
        <DecryptionPopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit} getData={PeopleService.getAllPeople}/>
      </Modal>
      <form onSubmit={onSubmit}>
        <div>
          <span>ID отправителя: </span>
          <input name="sender" value={state.sender || ''} readOnly required/>
          <span className="small-link" onClick={()=>{setPopupActive(true); setCurrentField('sender')}}>выбрать</span>
        </div>
        <div>
          <span>ID получателя: </span>
          <input name="recipient" value={state.recipient || ''} readOnly required/>
          <span className="small-link" onClick={()=>{setPopupActive(true); setCurrentField('recipient')}}>выбрать</span>
        </div>
        <div>Введите результат:</div>
        <div>
            <textarea className="msg-processing-result-textarea"
                      name="content"
                      value={state.content || ''}
                      onChange={handleChange}>
                      required
            </textarea>
        </div>
        <input type="submit" value="Отправить" />
      </form>
    </div>
  );
}