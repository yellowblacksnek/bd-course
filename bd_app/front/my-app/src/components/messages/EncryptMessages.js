import {ActionPage} from "../ActionPage";
import ResourceService from "../../services/ResourceService";
import {useState} from "react";
import ListPage from "../ListPage";

export default function EncryptMessages(props) {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState();
  const [popupActive, setPopupActive] = useState(false);

  const handlePageChange = (page) =>
    ResourceService.getResourceRaw( 'messages/search/findByDecEmpl',
      {page: page, size: 20, employee: localStorage.getItem("employee")}
    ).then( res => {
        const items = res.data["_embedded"]['messages']
          .filter(e => e.msgState == 'encrypting').map(e => ({
            id: e.id, content: e.content, sender: e.sender, recipient: e.recipient
          }));
        return {items, page};
      }
    );

  const submitForm = (data) => {
    if(!currentItem) return new Promise(() => false);
    data.id = currentItem.id;
    const body = {
      encContent: data.encContent,
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
    <ListPage
      // key={update}
      getData={handlePageChange}
      itemClickHandler={setCurrentItem}
      addHandler={handleAdd}
      removeHandler={handleRemove}
    />;

  return (
    <ActionPage
      key={update}
      popup={<EncryptionPopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>}
      popupStateHandler={{popupActive, setPopupActive}}
      displayedContent={messageContent()}
      list={list()}
      form={<EncryptionForm onSubmit={submitForm}/>}/>
      // handlePageChange={handlePageChange}/>
      // addHandler={handleAdd}/>
  );
}

function EncryptionPopup(props) {
  const [currentItem, setCurrentItem] = useState();

  const loadData = () => {
    return ResourceService.getResourceRaw( 'messages/search/findByMsgState',
      {state: "formed"}
    ).then( res => {
        console.log('formed received messages');
        const items = res.data["_embedded"]['messages']
          .map(e => ({
            id: e.id, content: e.content
          }));
        return {items};
      }
    );
  }

  const submit = () => {
    console.log(currentItem)
    if(!currentItem) return;
    ResourceService.updateResource(`messages/${currentItem.id}`,
      {decEmpl: localStorage.getItem("employee"), msgState: 'encrypting'}
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

function EncryptionForm(props) {
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
