import '../../styles/Messages.css'
import ListPage from "../ListPage";
import {useState} from "react";
import ResourceService from "../../services/ResourceService";
import {ActionPage} from "../ActionPage";

export default function DecryptMessages(props) {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState();

  const handlePageChange = (page) =>
    ResourceService.getResourceRaw( 'messages/search/findByDecEmpl',
      {page: page, size: 20, employee: 1072}
    ).then( res => {
        const items = res.data["_embedded"]['messages']
          .filter(e => e.msgState == 'decrypting').map(e => ({
            id: e.id, encContent: e.encContent
          }));
        return {items, page};
      }
    );

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
        <div>
          Текст сообщения [{currentItem.id}]:
          <div className="msg-processing-message">
            {currentItem.encContent}
          </div>
        </div>
      );
    else return (<div>Выберите сообщение из списка</div>);
  }

  const list =
    <ListPage
      // key={update}
      getData={handlePageChange}
      itemClickHandler={setCurrentItem}
      // addClickHandler={setCurrentItem}
      // removeClickHandler={setCurrentItem}
    />

  return (
    <ActionPage
      key={update}
      displayedContent={messageContent}
      list={list}
      form={<DecryptionForm onSubmit={submitForm}/>}
      handlePageChange={handlePageChange}/>
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
