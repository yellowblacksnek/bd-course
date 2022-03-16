import {useState} from "react";
import PeopleService from "../../services/PeopleService";
import toast from "react-hot-toast";
import {today} from "../Utils";

export default function EditPersonPopup(props) {
  const [item, setItem] = useState(props.item);
  const [state, setState] = useState({});

  const submit = (event) => {
    event.preventDefault()
    // console.log(state);
    console.log(item, props.item)
    let body = {};
    for(let key in item) {
      if(String(item[key]) !== String(props.item[key])) {
        // console.log(item[key], props.item[key], item[key] !== props.item[key])
        body[key] = item[key];
      }
    }
    PeopleService.updatePerson(props.item.id, body).then(res => {
      toast.success("Данные сохранены!");
    }).catch(err => {
      toast.error("Не удалось сохранить данные!");
    })
  }

  const handleChange = (event) => {
    setItem({...item, [event.target.name]:event.target.value})
  }

  return (
    <div>
      <div className="popup-form-title">{item.firstName} {item.lastName}</div>
      <form className="popup-form" onSubmit={submit} onReset={()=>setItem(props.item)}>
        <div>ID: {item.id}</div>
        <div className="form-field">Дата рождения: {item.birthDate}</div>
        <div className="form-field">ID двойника: {item.counterpart || 'Нет'}</div>
        <div className="form-field">Измерение рождения: {item.birthDim}</div>
        <div className="form-field">Измерение нахождения:
          <select name={"currentDim"} onChange={handleChange} defaultValue={item.currentDim}>
            <option disabled value="DISABLED">--</option>
            <option value="alpha">alpha</option>
            <option value="prime">prime</option>
          </select>
        </div>
        <div className="form-field">Знает?
          <select name={"knows"} onChange={handleChange} defaultValue={item.knows ? "true" : "false"}>
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        </div>
        <div className="form-field">Ограничение:
          <input type="date" name={"restrictUntil"} onChange={handleChange} value={item.restrictUntil || ''}/>
          <button className="small-link" type="button" onClick={()=>setItem({...item, restrictUntil: null})}>X</button>
        </div>
        <div className="form-field">Состояние:
          <select name={"personState"} onChange={handleChange} defaultValue={item.personState}>
            <option value="alive">alive</option>
            <option value="dead">dead</option>
            <option value="unknown">unknown</option>
          </select>
        </div>
        <div className="form-field">Дата смерти:
          <input type="date" name={"deathDate"} onChange={handleChange} value={item.deathDate || ''} max={today()}/>
          <button className="small-link" type="button" onClick={()=>setItem({...item, deathDate: null})}>X</button>
        </div>
        <div className="two-button-group">
          <input className="form-submit inline" type={"submit"} value={"Подтвердить"}/>
          <input className="form-submit inline" type={"reset"} value={"Сбросить"}/>
        </div>
      </form>
    </div>
  );
}