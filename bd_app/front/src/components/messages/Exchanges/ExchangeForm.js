import {useState} from "react";
import toast from "react-hot-toast";

export default function ExchangeForm(props) {
  const [state, setState] = useState({});
  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setState({...state,
      [name]: value    });
  }

  const onSubmit = (event) => {
    event.preventDefault();
    state.content = state.received ? state.content : '';

    if(new Date(String(props.currentItem._excTime).slice(0,-1)) > new Date()) {
      toast.error("Слишком рано!");
      return;
    }

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
        <input type="checkbox" name="received" checked={state.received || false} onChange={handleChange} disabled={state.status ? '' : 'disabled'}/>
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