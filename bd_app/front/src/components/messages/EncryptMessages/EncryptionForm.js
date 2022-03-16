import {useState} from "react";
import toast from "react-hot-toast";

export default function EncryptionForm(props) {
  const [state, setState] = useState({});
  const handleChange = (event) => {
    console.log(event)
    setState({...state, [event.target.name]: event.target.value});
  }

  const onSubmit = (event) => {
    event.preventDefault();

    props.onSubmit(state).then(res => {
      toast.success('Сообщение зашифровано!')
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