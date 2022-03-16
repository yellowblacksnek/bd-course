import {useEffect, useState} from "react";
import ResourceService from "../../services/ResourceService";
import EmployeesService from "../../services/EmployeesService";
import toast from "react-hot-toast";
import ListPage from "../list/ListPage";

export default function EditEmployeePopup(props) {
  const [item, setItem] = useState();
  const [state, setState] = useState({});
  const [positions, setPositions] = useState();
  const [position, setPosition] = useState();

  useEffect(()=> {
    ResourceService.getResourceRaw(`employees/${props.item.id}`, {projection: 'inline'})
      .then(res => {setItem(res.data); setState(res.data)});
  },[])

  useEffect(()=>{
    if(!state.department) return;

    EmployeesService.getPositionsByDepartment(state.department)
      .then(res => setPositions(res.map(i=> <option key={i.id} value={i.id}>{i.name}</option>)))
  }, [state.department])

  const submit = (event) => {
    event.preventDefault()
    if(state.accLvl === item.accLvl) return;
    let body = {accLvl: state.accLvl};
    EmployeesService.updateEmployee(props.item.id, body).then(res => {
      toast.success("Данные сохранены!");
      setItem({...item, ...body})
    }).catch(err => {
      toast.error("Не удалось сохранить данные!");
    })
  }

  const handleChange = (event) => {
    setState({...state, [event.target.name]:event.target.value})
  }

  const [currentPos, setCurrentPos] = useState();
  const [update,setUpdate] = useState();
  return (
    !item ? <div></div> :
      <div style={{width: 600}}>
        <div className="popup-form-title">{item.person.firstName} {item.person.lastName}</div>
        <form className="popup-form" onSubmit={submit} onReset={()=>setState({...state, accLvl:item.accLvl})}>
          <div className="form-field">ID сотрудника: {item.id}</div>
          <div className="form-field">ID человека: {item.person.id}</div>
          <div className="form-field">Знает: {item.person.knows ? 'Да' : 'Нет'}</div>
          <div className="form-field">Уровень допуска:
            <select name={"accLvl"}
                    onChange={handleChange}
                    value={state.accLvl}>
              <option value="restricted">restricted</option>
              <option value="standard">standard</option>
              <option value="high">high</option>
              <option value="max">max</option>
            </select>
          </div>
          <div className="form-field">Дата устройства: {item.employmentDate}</div>
          <div className="two-button-group">
            <input className="form-submit inline" type={"submit"} value={"Подтвердить"}/>
            <input className="form-submit inline" type={"reset"} value={"Сбросить"}/>
          </div>
        </form>
        <div className="popup-form-title">Добавить позицию</div>
        <form className="popup-form">
          <div className="form-field"><span>Отдел:</span>
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
            <span style={{marginLeft: 5}}>Позиция:</span>
            <select name={"position"} onChange={e=>setPosition(e.target.value)} defaultValue="DISABLED" required>
              <option disabled value="DISABLED"/>
              {positions}
            </select>
          </div>
        </form>
        <div style={{height: "300px"}}>
          <ListPage
            // getData={()=>(new Promise((resolve, reject)=>{resolve({items:item.positions})}))}
            key={update}
            getData={()=>ResourceService.getResource(`employees/${item.id}/positions`, 'positions', {})}
            columnWidths={{name: 200}}
            noSearch={true}
            itemClickHandler={setCurrentPos}
            removeHandler={(i)=>ResourceService.deleteResource(`employees/${item.id}/positions/${currentPos.id}`)
              .then(res=>{
                toast.success("Позиция удалена!");
                setUpdate(Date.now());
              })}
            addHandler={()=>{
              if(position) {
                ResourceService.addSubResource(`employees/${item.id}/positions`, `positions/${position}`)
                  .then(res=>{
                    toast.success("Позиция добалена!");
                    setUpdate(Date.now());
                  })
                  .catch(err => {
                    let msg = err.response.data;
                    if(msg.includes('counterpart in interface')) toast.error("Имеет двойника во взаимодействии!");
                    else if(msg.includes('non-interface must know')) toast.error("Этот человек не знает о другом измерении!");
                    else if(msg.includes('unique')) toast.error("Уже на этой должности!");
                  });
              }
            }}
          />
        </div>
      </div>
  );
}