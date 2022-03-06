import {ActionPage} from "../ActionPage";
import {useState} from "react";
import ResourceService from "../../services/ResourceService";
import ListPage from "../ListPage";

export default function Exchange(props) {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState();

  const handlePageChange = (page) =>
    ResourceService.getResourceRaw( 'msgExchanges/search/findByEmployee',
      {employee: 4}
    ).then( res => {
        const items = res.data["_embedded"]['msgExchanges']
          .filter(e => e.msgExState == 'scheduled').map(e => ({
            id: e.id, room: e.room, excTime:e.excTime, outMsg:e.outMsg, inMsg:e.inMsg
          })).sort((a,b)=>(a.excTime>b.excTime));
        return {items};
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
        if(res.status === 201) {
          console.log(res)
          setCurrentItem();
          setUpdate(Date.now());
        }
      });
  }



  const messageContent = () => {
    if(currentItem)
      return (
        <div>
          Сообщения для обмена [{currentItem.id}]:
          <div className="msg-processing-message">
            {currentItem.outMsg}
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
      form={<ExchangeForm onSubmit={submitForm}/>}
      handlePageChange={handlePageChange}/>
  );
}

function ExchangeForm(props) {
  const [state, setState] = useState({});
  const handleChange = (event) => {
    // console.log(event)
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setState({...state,
      [name]: value    });
  }

  const onSubmit = (event) => {
    event.preventDefault();
    state.content = state.received ? state.content : '';
    console.log(state)
    props.onSubmit(state).then(res => {
      if(res) setState({});
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input type="checkbox" name="status" checked={state.status || false} onChange={handleChange}/>
        <span>Обмен прошёл успешно</span>
      </div>
      <div>
        <input type="checkbox" name="received" checked={state.received || false} onChange={handleChange}/>
        <span>Было получено сообщение</span>
      </div>
      <div>Введите результат:</div>
      <div>
            <textarea className="msg-processing-result-textarea"
                      name="content"
                      value={(state.received && state.content) || ''}
                      onChange={handleChange}
                      disabled={state.received ? '' : 'disabled'}>
            </textarea>
      </div>
      <input type="submit" value="Отправить" />
    </form>
  );
}