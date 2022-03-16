import ListPage from "../list/ListPage";
import ResourceService from "../../services/ResourceService";
import {ActionPage} from "../ActionPage";
import {useEffect, useState} from "react";
import {today} from "../Utils";
import RouteService from "../../services/RouteService";
import PeopleService from "../../services/PeopleService";
import Modal from "react-modal";
import toast from "react-hot-toast";

export default function ViolationsList() {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState(Date.now());
  const [popupActive, setPopupActive] = useState(false);

  const loadViolations = (page,sort,search) => (
    ResourceService.getResource( 'violations','violations',
      {page, sort, search}
    ).then(res=>{
      res.items.forEach(i => (delete i.person));
      return res;
    }))

  const list = () =>
    <div style={{height: "100%"}}>
      <Modal
        isOpen={popupActive}
        onRequestClose={()=>{setPopupActive(false)}}
        className={'popup'}
        overlayClassName={'popup-container'}
      >
        <NewViolationPopup item={currentItem} stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>
      </Modal>
      <ListPage
        notSortable={["personId"]}
        getData={loadViolations}
        addHandler={RouteService.hasAccess("high") ? () => setPopupActive(true) : undefined}
        itemClickHandler={setCurrentItem}
      />
    </div>

  const handlePopupSubmit = () => {
    setPopupActive(false);
    setUpdate(Date.now())
  }

  return (
    <ActionPage
      key={update}
      list={list()}
    />

  );
}

function NewViolationPopup(props) {
  const [state, setState] = useState({types:[]});

  const submit = (event) => {
    event.preventDefault()
    // console.log(state);

    if(state.end < state.start || !state.type) return;
    const body = {
      person: ResourceService.getURI('people', state.id),
      issueDate: today(),
      description:state.description,
      violationType: state.type,
      violationState: 'awaits_review'
    }
    ResourceService.postResource('violations', body)
      .then(res => {
        toast.success(`Нарушение добавлено! [ID ${res.data.id}]`)
        props.onSubmit();
      }).catch(()=>{toast.error("Не удалось создать нарушение")});
  }

  const handleChange = (event) => {
    state[event.target.name] = event.target.value;
    setState({...state})
  }

  useEffect(()=>{
    ResourceService.getResource('violationTypes', 'violationTypes', {})
      .then(res => {
        res = res.items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)
        setState({...state, types: res})
      })
  }, [])

  return (
  <div className="new-message-popup">
      <div>
        <div className="popup-form-title">Новое нарушение</div>
        <form className="popup-form" onSubmit={submit}>
          <div className="form-field">ID человека:<input type={"number"} name={"id"} value={state.id || ''} onChange={handleChange} required/></div>
          <div className="form-field">Тип нарушения:
            <select name={"type"} onChange={handleChange} defaultValue={"DEFAULT"} required>
              <option disabled value="DEFAULT">--</option>
              {state.types}
            </select>
          </div>
          <textarea  className="form-textarea" name={"description"} onChange={handleChange} required/>

          <input className="form-submit" type={"submit"} value={"Подтвердить"}/>
        </form>
      </div>
    {/*<div>*/}
    <div className="person-select new-message-person-select" id="person-picker">
      {<ListPage
        getData={(page,sort, search)=>{
          return PeopleService.getAllPeople(page, sort, search).then(res => {
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