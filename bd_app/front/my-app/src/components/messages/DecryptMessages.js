import '../../styles/ActionPage.css'
import '../../styles/Messages.css'

import ListPage from "../ListPage";
import {useState} from "react";
import ResourceService from "../../services/ResourceService";
import {ActionPage} from "../ActionPage";

export default function DecryptMessages(props) {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState(Date.now());
  const [popupActive, setPopupActive] = useState(false);

  const handlePageChange = (page) => {
    return ResourceService.getResourceRaw( 'messages/search/findByDecEmpl',
      {page: page, size: 20, employee: localStorage.getItem("employee")}
    ).then( res => {
        const items = res.data["_embedded"]['messages']
          .filter(e => e.msgState == 'decrypting').map(e => ({
            id: e.id, encContent: e.encContent
          }));
        return {items, page};
      }
    )};

  const submitForm = (data) => {
    if(!currentItem) return new Promise(() => false);
    data.id = currentItem.id;
    const body = {
      sender: data.sender,
      recipient: data.recipient,
      content: data.content,
      msgState: 'decrypted'
    }

    return ResourceService.updateResource(`messages/${data.id}`, body)
      .then(res => {
        if(res.status === 200) {
          setCurrentItem();
          setUpdate(Date.now());
        }
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
    ResourceService.updateResource(`messages/${currentItem.id}`, body)
      .then(res => {
        if(res.status === 200) {
          setCurrentItem();
          setUpdate(Date.now());
        }
      });
  }

  const list = () => {
    return (
    <ListPage
      // key={update}
      getData={handlePageChange}
      itemClickHandler={setCurrentItem}
      addHandler={handleAdd}
      removeHandler={handleRemove}
      // addClickHandler={setCurrentItem}
      // removeClickHandler={setCurrentItem}
    />);
  }

  const handlePopupSubmit = () => {
    setPopupActive(false);
    setUpdate(Date.now());
  }

  return (
    <ActionPage
      key={update}
      popup={<DecryptionPopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>}
      popupStateHandler={{popupActive, setPopupActive}}
      displayedContent={messageContent()}
      list={list()}
      form={<DecryptionForm onSubmit={submitForm}/>}/>
  );
}

function DecryptionPopup(props) {
  const [currentItem, setCurrentItem] = useState();

  const loadData = () => {
    return ResourceService.getResourceRaw( 'messages/search/findByMsgState',
      {state: "received"}
    ).then( res => {
      console.log('loaded received messages');
      const items = res.data["_embedded"]['messages']
          .map(e => ({
            id: e.id, encContent: e.encContent
          }));
        return {items};
      }
    );
  }

  const submit = () => {
    if(!currentItem) return;
    ResourceService.updateResource(`messages/${currentItem.id}`,
      {decEmpl: localStorage.getItem("employee"), msgState: 'decrypting'}
    ).then(res => {
      if(res.status === 200) {
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

function DecryptionForm(props) {
  const [state, setState] = useState({});
  const handleChange = (event) => {
    console.log(event)
    setState({...state, [event.target.name]: event.target.value});
  }

  const onSubmit = (event) => {
    event.preventDefault();
    props.onSubmit(state).then(res => {
      if(res) setState({});
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <span>ID отправителя: </span>
        <input name="sender" value={state.sender || ''} onChange={handleChange}/>
      </div>
      <div>
        <span>ID получателя: </span>
        <input name="recipient" value={state.recipient || ''} onChange={handleChange}/>
      </div>
      <div>Введите результат:</div>
      <div>
            <textarea className="msg-processing-result-textarea"
                      name="content"
                      value={state.content || ''}
                      onChange={handleChange}>
            </textarea>
      </div>
      <input type="submit" value="Отправить" />
    </form>
  );
}
