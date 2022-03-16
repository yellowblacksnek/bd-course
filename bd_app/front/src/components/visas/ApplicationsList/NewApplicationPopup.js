import {useState} from "react";
import toast from "react-hot-toast";
import ResourceService from "../../../services/ResourceService";
import {today} from "../../Utils";
import ListPage from "../../list/ListPage";
import PeopleService from "../../../services/PeopleService";

export default function NewApplicationPopup(props) {
  const [state, setState] = useState({});

  const submit = (event) => {
    event.preventDefault()
    // console.log(state);

    if(state.end <= state.start) {
      toast.error("Дата истечения должна быть позднее даты начала!");
      return;
    }
    if(!state.id) {
      toast.error("Не выбран человек!");
      return;
    }
    const body = {
      person: ResourceService.getURI('people', state.id),
      applicationDate: today(),
      startDate: state.start,
      expDate: state.end,
      trans: state.trans,
      visaAppState: 'awaits_review'
    }
    ResourceService.postResource('visaApplications', body)
      .then(res => {
        toast.success(`Заявка создана! [ID ${res.data.id}]`);
        props.onSubmit();
      })
      .catch(err => {
        let msg = err.response.data;
        if(msg.includes('active application exists'))
          toast.error('У этого человека уже есть активная заявка!');
        if(msg.includes('another dim'))
          toast.error('Этот человек из другого измерения и не сотрудник!');
      });
  }

  const handleChange = (event) => {
    state[event.target.name] = event.target.value;
    setState({...state})
  }

  return (
    <div className="new-application-popup">
      <div>
        <div className="popup-form-title">Новое заявление</div>
        <form className="popup-form" onSubmit={submit}>
          <div className="form-field">ID отправителя:<input type={"number"} name={"id"} value={state.id || ''} readOnly required/></div>
          <div className="form-field">Дата начала действия визы:<input type={"date"} name={"start"} min={today()} onChange={handleChange} required/></div>
          <div className="form-field">Дата окончания действия визы:<input type={"date"} name={"end"} min={state.start} onChange={handleChange} required/></div>
          <div className="form-field">Количество переходов:<input type={"number"} name={"trans"} min={1} onChange={handleChange} required/></div>
          <input className="form-submit" type={"submit"} value={"Подтвердить"}/>
        </form>
      </div>
      {/*<div>*/}
      <div className="person-select new-message-person-select" id="person-picker">
        {<ListPage
          getData={(page,sort, search)=>{
            return PeopleService.getAllPeople(page, sort, search).then(res => {//{...search, birthDim: JSON.parse(localStorage.getItem('dimension'))}
              res.items = res.items.map(i => ({id: i.id, firstName: i.firstName, lastName: i.lastName, birthDim: i.birthDim}))
              return res;
            })
          }}
          itemClickHandler={item=>setState({...state, id: item.id})}/>}
      </div>
      {/*</div>*/}
    </div>

  );
}