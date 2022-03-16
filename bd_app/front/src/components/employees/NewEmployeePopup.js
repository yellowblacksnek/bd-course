import {useEffect, useRef, useState} from "react";
import {today} from "../Utils";
import EmployeesService from "../../services/EmployeesService";
import toast from "react-hot-toast";
import ListPage from "../list/ListPage";
import PeopleService from "../../services/PeopleService";

export default function NewEmployeePopup(props) {
  const [state, setState] = useState({});
  // const [pickerActive, setPickerActive] = useState(false);
  const [knows, setKnows] = useState(true)
  const [msg, setMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const personInputField = useRef(null);

  const submit = (event) => {
    event.preventDefault()

    if(!state.person || !state.person.id || !state.position || !state.access) return;

    const body = {
      person: state.person.id,
      position: state.position,
      access: state.access,
      date: today()
    }
    EmployeesService.postEmployee(body).then(res => {
      if(res.status === 201) {
        setSuccess(true);
        toast.success("Должность назначена, ID сотрудника: " + res.data);
      }
    }).catch(err => {
      setSuccess(false);
      let msg = err.response.data;
      if(msg.includes('no counterpart')) toast.error("Этот человек не имеет записи о двойнике!");
      else if(msg.includes('counterpart in interface')) toast.error("Имеет двойника во взаимодействии!");
      else if(msg.includes('non-interface must know')) toast.error("Этот человек не знает о другом измерении!");
      else if(msg.includes('unique')) toast.error("Уже на этой должности!");
      else console.log(msg);
    })
  }

  const handleChange = (event) => {
    state[event.target.name] = event.target.value;
    setState({...state})
  }
  const [positions, setPositions] = useState();
  useEffect(()=>{
    if(!state.department) return;
    (state.department === 'interface') ? setKnows('') : setKnows(true);

    EmployeesService.getPositionsByDepartment(state.department)
      .then(res => setPositions(res.map(i=> <option key={i.id} value={i.id}>{i.name}</option>)))
  }, [state.department])
  useEffect(()=>setState({...state, person: ''}), [knows])

  return (
    <div id="new-employee-popup">
      <div className="popup-form-title">Наем сотрудника</div>
      <form className="popup-form" onSubmit={submit}>
        <div className="form-field">ID человека:<input ref={personInputField} type={"number"} name={"person"} value={state.person ? state.person.id : ''} readOnly required/> {/*onChange={handleChange}*/}
          <span className="person-select-hint">  (Выберите из списка ниже)</span>
        </div>
        <div className="form-field">Уровень допуска:
          <select name={"access"} onChange={handleChange} defaultValue="DISABLED" required>
            <option disabled value="DISABLED"/>
            <option value="restricted">restricted</option>
            <option value="standard">standard</option>
            <option value="high">high</option>
            <option value="max">max</option>
          </select>
        </div>
        <div className="form-field">Отдел:
          <select name={"department"} onChange={handleChange} defaultValue="DISABLED" required>
            <option disabled value="DISABLED"/>
            <option value="interface">interface</option>
            <option value="decryption">decryption</option>
            <option value="analysis">analysis</option>
            <option value="strategy">strategy</option>
            <option value="operations">operations</option>
            <option value="customs">customs</option>
            <option value="diplomacy">diplomacy</option>
          </select>
        </div>
        <div className="form-field">Позиция:
          <select name={"position"} onChange={handleChange} defaultValue="DISABLED"  disabled={state.department ? '' : 'disabled'} required>
            <option disabled value="DISABLED"/>
            {positions}
          </select>
        </div>
        <input className="form-submit" type={"submit"} value={"Подтвердить"}/>
        <div className={success ? "popup-form-message good" : "popup-form-message"}>{msg}</div>
      </form>
      <div className="person-select" id="person-picker">
        {<ListPage
          key={knows}
          getData={(page,sort, search)=>PeopleService.getRecruitPeople(page,sort,search, knows)}
          itemClickHandler={item=>setState({...state, person: item})}/>}
      </div>
    </div>
  );
}