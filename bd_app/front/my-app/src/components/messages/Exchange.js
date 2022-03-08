import '../../styles/Exchanges.css'

import {ActionPage} from "../ActionPage";
import {useEffect, useState} from "react";
import ResourceService from "../../services/ResourceService";
import ListPage from "../ListPage";

export default function Exchange(props) {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState();
  const [popupActive, setPopupActive] = useState(false);

  const handlePageChange = (page) =>
    ResourceService.getResourceRaw( 'msgExchanges/search/findByEmployee',
      {employee: localStorage.getItem("employee")}
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
          // console.log(res)
          setCurrentItem();
          setUpdate(Date.now());
        }
      });
  }



  const messageContent = () => {
    if(currentItem)
      return (
        <div className="msg-processing-message-container">
          <div className="msg-processing-message-header">
            Текст сообщения для обмена[{currentItem.id}]:
          </div>
          <div className="msg-processing-message-wrapper">
            <div className="msg-processing-message">
              {currentItem.encContent}
            </div>
          </div>
        </div>
      );
    else return (<div>Выберите обмен из списка</div>);
  }

  const handleAdd = () => {
    // console.log('add pressed')
    // setPopupActive(true);
    setPopupActive(true);
  }

  const handleRemove = () => {
    // console.log('remove pressed')
    // setPopupActive(true);
    if(!currentItem) return;
    const body = {
      id: currentItem.id
    }
    ResourceService.postResource(`msgExchanges/unschedule`, body)
      .then(res => {
        if(res.status === 201) {
          setCurrentItem();
          setUpdate(Date.now());
        }
      });
  }

  const list = () =>
    <ListPage
      // key={update}
      getData={handlePageChange}
      itemClickHandler={setCurrentItem}
      addHandler={handleAdd}
      removeHandler={handleRemove}
    />

  const handlePopupSubmit = () => {
    setPopupActive(false);
    setUpdate(Date.now());
  }

  return (
    <ActionPage
      key={update}
      popup={<ExchangePopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>}
      popupStateHandler={{popupActive, setPopupActive}}
      displayedContent={messageContent()}
      list={list()}
      form={<ExchangeForm onSubmit={submitForm}/>}/>
  );
}

function ExchangePopup(props) {
  const [currentItem, setCurrentItem] = useState();
  const [room, setRoom] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState();

  const loadData = () => {
    return ResourceService.getResourceRaw( 'messages/search/findByMsgState',
      {state: "encrypted"}
    ).then( res => {
        // console.log('loaded encrypted messages');
        const items = res.data["_embedded"]['messages']
          .map(e => ({
            id: e.id, encContent: e.encContent
          }));
        return {items};
      }
    );
  }

  const submit = (event) => {
    event.preventDefault();
    console.log('submit', date, room, time);
    // console.log('submit date', new Date(`${date}T${time}:00`).toISOString());
    if(!currentItem) return;
    const body = {
      id: currentItem.id,
      employee: localStorage.getItem("employee"),
      room: room,
      time: new Date(`${date}T${time}:00Z`).toISOString().slice(0,-1)
    }
    ResourceService.postResource(`msgExchanges/schedule`,
      body
    ).then(res => {
      if(res.status === 201) {
        // console.log(res)
        props.onSubmit();
        props.stateHandler(false);
      }
    });
  }

  // const rooms = Array.from({length: 29}, (_, i) => i + 1)
  //   .map(i => <option>{i}</option>)

  const getTimes = (d) => {
    d.setHours(10);
    d.setMinutes(0);
    d.setSeconds(0);

    let max = new Date(d);
    max.setHours(21);
    max.setMinutes(1);

    let times = [];
    while(d < max) {
      times.push({
        time:new Date(d),
        value: `${d.getHours()}:${d.getMinutes() === 30 ? d.getMinutes() : '00'}`});
      d.setMinutes(d.getMinutes()+30);
    }
    return times;
  }
  const [times, setTimes] = useState(getTimes(new Date()).map(i => <option key={i.value}>{i.value}</option>));

  // const times = getTimes().map(i => <option>{i.toString()}</option>);

  const today = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    return String(yyyy + '-' + mm + '-' + dd);
  }

  const timeRangeForDay = (day) => {
    let to = new Date(day);
    to.setHours(25);
    return {from: day.toISOString(), to: to.toISOString()};
  }

  useEffect(()=> {
    if (date && room) {
      // console.log(new Date(date), room)
      const range = timeRangeForDay(new Date(date))
      // console.log('range', range);
      ResourceService.getResourceRaw( 'msgExchanges/search/findOccupied',
        {...range, room, employee: localStorage.getItem("employee")}
      ).then( res => {
          // console.log('loaded exchanges');
          // console.log(res.data)
          const occupied = res.data["_embedded"]['msgExchanges']
            .map(e => ({
              id: e.id, time: new Date(e.excTime.slice(0,-1))
            }));
          console.log(occupied)
          // console.log(getTimes(new Date(date)))
          setTimes(getTimes(new Date(date))
            .filter(i => {
              for (const k of occupied) {
                // console.log(i.time, k.time, i.time.getTime() === k.time.getTime())
                if (i.time.getTime() === k.time.getTime()) return false;
              }
              return true;
            })
            .map(i => <option key={i.value}>{i.value}</option>));
        }
      );
    }
  }, [room, date]);

  const handleChange = (event) => {
    if(event.target.name === 'room')
      setRoom(event.target.value);
    else if (event.target.name === 'date')
      setDate(event.target.value);
    else
      setTime(event.target.value)
  }

  return (
    <div className="exchanges-popup-container">
      <div className="exchanges-popup-list-wrapper">
        <ListPage
          // key={update}
          getData={loadData}
          itemClickHandler={setCurrentItem}
        />
      </div>
      <form onSubmit={submit}>
        <div>
          {/*<button onClick={submit}>Ok</button>*/}
          <div><input type={"number"} name={"room"} min={"1"} max={"30"} onChange={handleChange}/></div>
          <div><input type={"date"} name={"date"} min={today()} onChange={handleChange}/></div>
          {/*<div><input type={"time"} min="10:00" max="21:00"/></div>*/}
          <div><select onChange={handleChange} defaultValue={"disabled"}>
            <option value={"disabled"} disabled>Выберите время</option>
            {times}
          </select></div>
          <input type={"submit"} value={"Ok"}/>
        </div>
      </form>
    </div>
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
    // console.log(state)
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