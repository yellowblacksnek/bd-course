import {useState} from "react";
import PeopleService from "../../services/PeopleService";
import {today} from "../Utils";
import toast from "react-hot-toast";

export default function NewPersonPopup(props) {
  const [state, setState] = useState({});

  const submit = (event) => {
    event.preventDefault()
    // console.log(state);
    if(!state.birthDim) return;
    const body = {
      ...state,
      personState: 'alive'
    }
    PeopleService.postPerson(body).then(res => {
      toast.success(`Человек создан! [ID: ${res.data.id}]`);
      props.onSubmit();
    }).catch(err => toast.error(`Не удалось создать!`))
  }

  const handleChange = (event) => {
    state[event.target.name] = event.target.value;
    setState({...state})
  }

  return (
    <div>
      <div className="popup-form-title">Новый человек</div>
      <form className="popup-form" onSubmit={submit}>
        <div className="form-field">Имя:<input type={"text"} name={"firstName"} onChange={handleChange} required/> обязательно</div>
        <div className="form-field">Фамилия:<input type={"text"} name={"lastName"} onChange={handleChange} required/> обязательно</div>
        <div className="form-field">Дата рождения:<input type={"date"} name={"birthDate"} max={today()} onChange={handleChange}/></div>
        <div className="form-field">ID двойника:<input type={"number"} name={"counterpart"} onChange={handleChange} /></div>
        <div className="form-field">Измерение рождения:
          <select name={"birthDim"} onChange={handleChange} defaultValue="DISABLED" required>
            <option disabled value="DISABLED">--</option>
            <option value="alpha">alpha</option>
            <option value="prime">prime</option>
          </select>
          обязательно

        </div>
        <div className="form-field">Измерение нахождения:
          <select name={"currentDim"} onChange={handleChange}defaultValue="DISABLED">
            <option disabled value="DISABLED">--</option>
            <option value="alpha">alpha</option>
            <option value="prime">prime</option>
          </select>
        </div>
        <div className="form-field">Знает?
          <select name={"knows"} onChange={handleChange} defaultValue="DISABLED">
            <option disabled value="DISABLED">--</option>
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        </div>
        <input className="form-submit" type={"submit"} value={"Подтвердить"}/>
      </form>
    </div>
  );
}