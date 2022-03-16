import '../../../styles/ActionPage.css'
import '../../../styles/Messages.css'

import ListPage from "../../list/ListPage";
import {useState} from "react";
import ResourceService from "../../../services/ResourceService";
import {ActionPage} from "../../ActionPage";
import MessagesService from "../../../services/MessagesService";
import Modal from "react-modal";
import PeopleService from "../../../services/PeopleService";
import toast from "react-hot-toast";
import DecryptionForm from "./DecryptionForm";
import DecryptionPopup from "./DecryptionPopup";

export default function DecryptMessages(props) {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState(Date.now());
  const [popupActive, setPopupActive] = useState(false);

  const submitForm = (data) => {
    if(!currentItem) return new Promise(() => false);
    return MessagesService.submitDecrypted(currentItem.id, data)
    .then(_ => {
        setCurrentItem();
        setUpdate(Date.now());
    });
  }

  const messageContent = () => {
    if(currentItem)
      return (
        <div className="msg-processing-message-container">
          <div className="msg-processing-message-header">
            Текст сообщения [{currentItem.id}]:
          </div>
          <div className="msg-processing-message-wrapper">
            <div className="msg-processing-message">
              {currentItem.encContent}
            </div>
          </div>
        </div>
      );
    else return (<div>Выберите сообщение из списка</div>);
  }

  const handleAdd = () => {
    console.log('add pressed')
    // setPopupActive(true);
    setPopupActive(true);
  }

  const handleRemove = () => {
    console.log('remove pressed')
    // setPopupActive(true);
    if(!currentItem) return;
    const body = {
      decEmpl: '',
      msgState: 'received'
    }
    MessagesService.updateMessage(currentItem.id, body)
      .then(_ => {
          setCurrentItem();
          setUpdate(Date.now());
      });
  }

  function loadDecrypting(page,sort,search) {
    return ResourceService.getResource( 'messages','messages',
      {page, sort, size: 20, search: {...search, decEmpl: localStorage.getItem("employee"), msgState: 'decrypting'}}
    ).then( res => {
      res.items = res.items.map(e => ({id: e.id, encContent: e.encContent}));
      return res;
    })
  }

  function loadReceived(page,sort,search) {
    return MessagesService.getMessagesSearch(page, sort, {...search, msgState: 'received'})
      .then(res => {res.items = res.items.map(e => ({id: e.id, encContent: e.encContent, creationTime: e.creationTime}))
        return res;});
  }

  const list = () => {
    return (
      <div style={{height: "100%"}}>
        <Modal
          isOpen={popupActive}
          onRequestClose={()=>{setPopupActive(false)}}
          className={'popup'}
          overlayClassName={'popup-container'}
        >
          <DecryptionPopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit} getData={loadReceived}/>
        </Modal>
        <ListPage
          // key={update}
          noSearch={true}
          getData={loadDecrypting}
          itemClickHandler={setCurrentItem}
          addHandler={handleAdd}
          removeHandler={handleRemove}
        />
      </div>
    );
  }

  const handlePopupSubmit = (item) => {
    if(!item) return;
    MessagesService.submitDecrypting(item.id);
    setPopupActive(false);
    setUpdate(Date.now());
  }

  return (
    <ActionPage
      key={update}
      displayedContent={messageContent()}
      list={list()}
      form={<DecryptionForm onSubmit={submitForm}/>}/>
  );
}

