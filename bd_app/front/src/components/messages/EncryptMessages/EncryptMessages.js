import {ActionPage} from "../../ActionPage";
import ResourceService from "../../../services/ResourceService";
import {useState} from "react";
import ListPage from "../../list/ListPage";
import Modal from "react-modal";
import EncryptionForm from "./EncryptionForm";
import EncryptionPopup from "./EncryptionPopup";

export default function EncryptMessages(props) {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState();
  const [popupActive, setPopupActive] = useState(false);

  const loadEncrypting = (page,sort,search) =>
    ResourceService.getResource( 'messages','messages',
      {page, sort, size: 20, search: {...search, decEmpl: localStorage.getItem("employee"), msgState: 'encrypting'}}
    ).then( res => {
          res.items = res.items.map(e => ({
            id: e.id, content: e.content, sender: e.sender, recipient: e.recipient
          }));
        return res;
      }
    );

  const submitForm = (data) => {
    if(!currentItem) return new Promise(() => false);
    data.id = currentItem.id;
    const body = {
      encContent: data.content,
      msgState: 'encrypted'
    }

    return ResourceService.updateResource(`messages/${data.id}`, body)
      .then(res => {
        if(res.status === 200) {
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
      decEmpl: '',
      msgState: 'formed'
    }
    ResourceService.updateResource(`messages/${currentItem.id}`, body)
      .then(res => {
        if(res.status === 200) {
          setCurrentItem();
          setUpdate(Date.now());
        }
      });
  }

  const handlePopupSubmit = () => {
    setPopupActive(false);
    setUpdate(Date.now());
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
              {currentItem.content}
            </div>
          </div>
        </div>
      );
    else return (<div>Выберите сообщение из списка</div>);
  }

  const list = () =>
    <div style={{height: "100%"}}>
      <Modal
        isOpen={popupActive}
        onRequestClose={()=>{setPopupActive(false)}}
        className={'popup'}
        overlayClassName={'popup-container'}
      >
        <EncryptionPopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>
      </Modal>
      <ListPage
        // key={update}
        noSearch={true}
        getData={loadEncrypting}
        itemClickHandler={setCurrentItem}
        addHandler={handleAdd}
        removeHandler={handleRemove}
      />
    </div>;

  return (
    <ActionPage
      key={update}
      displayedContent={messageContent()}
      list={list()}
      form={<EncryptionForm onSubmit={submitForm}/>}/>
  );
}
