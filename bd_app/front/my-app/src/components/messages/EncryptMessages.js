import {ActionPage} from "../ActionPage";
import ResourceService from "../../services/ResourceService";
import {useState} from "react";
import ListPage from "../ListPage";

export default function EncryptMessages(props) {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState();

  const handlePageChange = (page) =>
    ResourceService.getResourceRaw( 'messages/search/findByDecEmpl',
      {page: page, size: 20, employee: 1072}
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

  const messageContent = () => {
    if(currentItem)
      return (
        <div>
          Текст сообщения [{currentItem.id}]:
          <div className="msg-processing-message">
            {currentItem.content}
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
    />

  return (
    <ActionPage
      key={update}
      displayedContent={messageContent}
      list={list}
      form={<EncryptionForm onSubmit={submitForm}/>}
      handlePageChange={handlePageChange}/>
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
