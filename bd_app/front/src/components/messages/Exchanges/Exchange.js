import '../../../styles/Exchanges.css'

import {ActionPage} from "../../ActionPage";
import {useEffect, useState} from "react";
import ResourceService from "../../../services/ResourceService";
import ListPage from "../../list/ListPage";
import {today} from "../../Utils";
import Modal from "react-modal";
import toast from "react-hot-toast";
import MessagesService from "../../../services/MessagesService";
import ExchangeForm from "./ExchangeForm";
import ExchangePopup from "./ExchangePopup";

export default function Exchange(props) {
  const [currentItem, setCurrentItem] = useState();
  const [currentMessage, setCurrentMessage] = useState();
  const [update, setUpdate] = useState();
  const [popupActive, setPopupActive] = useState(false);

  const loadExchanges = (page,sort,search) =>
    ResourceService.getResource( `msgExchanges`,'msgExchanges',
      {page,sort, search:{...search, employee: localStorage.getItem('employee'), msgExState: 'scheduled'}}
    ).then( res => {
        res.items = res.items.map(e => ({
            id: e.id, room: e.room, excTime:e.excTime.replace('T',' ').replace('Z','').slice(0,-3), outMsg:e.outMsg, _excTime:e.excTime
          }));
        return res;
      }
    );

  const submitForm = (data) => {
    if(!currentItem) return new Promise(() => false);
    const body = {
      id: currentItem.id,
      state: data.status ? 'ok' : 'fail',
      text: data.content
    }

    return ResourceService.postResource(`msgExchanges/report`, body)
      .then(res => {
          // console.log(res)
        toast.success("Успешно!")
        setCurrentItem();
        setUpdate(Date.now());
      }).catch(err => {
        toast.error(err.response);
      });
  }

  function loadMessage(id) {
    MessagesService.getMessage(id).then(res=>setCurrentMessage(res));
  }

  useEffect(()=>{if(currentItem)loadMessage(currentItem.outMsg)}, [currentItem])

  const messageContent = () => {
    if(currentItem && currentMessage)
      return (
        <div className="msg-processing-message-container">
          <div className="msg-processing-message-header">
            Текст сообщения для обмена[{currentItem.id}]:
          </div>
          <div className="msg-processing-message-wrapper">
            <div className="msg-processing-message">
              {currentMessage ? currentMessage.encContent : ''}
            </div>
          </div>
        </div>
      );
    else return (<div>Выберите обмен из списка</div>);
  }

  const handleAdd = () => {
    setPopupActive(true);
  }

  const handleRemove = () => {
    if(!currentItem) return;
    const body = {
      id: currentItem.id
    }
    ResourceService.postResource(`msgExchanges/unschedule`, body)
      .then(res => {
        if(res.status === 201) {
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
        <ExchangePopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>
      </Modal>
      <ListPage
        // key={update}
        columnWidths={{excTime: 200}}
        getData={loadExchanges}
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
      // popup={<ExchangePopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>}
      // popupStateHandler={{popupActive, setPopupActive}}
      displayedContent={messageContent()}
      list={list()}
      form={<ExchangeForm onSubmit={submitForm} currentItem={currentItem}/>}/>
  );
}