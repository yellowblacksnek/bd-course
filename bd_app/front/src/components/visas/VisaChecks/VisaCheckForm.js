import {useState} from "react";
import toast from "react-hot-toast";

export default function VisaChecksForm(props) {
  const [state, setState] = useState({});
  const handleChange = (event) => {
    state[event.target.name] = event.target.value;
    setState({...state});
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if(!state.verdict) return;
    props.onSubmit(state).then(res => {
      setState({});
      toast.success("Проверка закончена!")
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <span>Вердикт: </span>
        <select name="verdict" onChange={handleChange} defaultValue={"DISABLED"} required>
          <option disabled value={"DISABLED"}>---</option>
          <option value={"granted"}>Одобрено</option>
          <option value={"not_granted"}>Не одобрено</option>
        </select>
      </div>
      <div>Комментарий к заявке:</div>
      <div>
            <textarea className="msg-processing-result-textarea"
                      name="comment"
                      onChange={handleChange}/>
      </div>
      <input type="submit" value="Отправить" />
    </form>
  );
}