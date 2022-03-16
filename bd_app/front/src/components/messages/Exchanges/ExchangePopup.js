import {useEffect, useState} from "react";
import ResourceService from "../../../services/ResourceService";
import ListPage from "../../list/ListPage";
import {today} from "../../Utils";

export default function ExchangePopup(props) {
  const [currentItem, setCurrentItem] = useState();
  const [room, setRoom] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState();

  const loadData = (page,sort,search) => {
    return ResourceService.getResourceSearch( 'messages',
      {...search, msgState: "encrypted"}, {page,sort})
      .then( res => {
        // console.log('loaded encrypted messages');
        res.items = res.items.map(e => ({
            id: e.id, encContent: e.encContent
          }));
        return res;
      }
    );
  }

  const submit = (event) => {
    event.preventDefault();
    console.log('submit', date, room, time);
    if(!currentItem) return;
    const body = {
      id: currentItem.id,
      employee: localStorage.getItem("employee"),
      room: room,
      time: new Date(`${date}T${time}:00Z`).toISOString()
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


  const timeRangeForDay = (day) => {
    let to = new Date(day);
    to.setHours(25);
    return {from: day.toISOString(), to: to.toISOString()};
  }

  useEffect(()=> {
    if (date && room) {
      const range = timeRangeForDay(new Date(date))
      ResourceService.getResourceRaw( 'msgExchanges/search/findOccupied',
        {...range, room, employee: localStorage.getItem("employee")}
      ).then( res => {
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
    <div className="list-popup">
      <div className="exchanges-popup-list-wrapper">
        <ListPage
          // key={update}
          getData={loadData}
          itemClickHandler={setCurrentItem}
        />
      </div>
      <form onSubmit={submit}>
        <div>
          <div>Номер комнаты: <input type={"number"} name={"room"} min={"1"} max={"30"} placeholder="(1-30)" style={{width: "40px"}} onChange={handleChange} required/></div>
          <div>Дата: <input type={"date"} name={"date"} min={today()} onChange={handleChange} required/></div>
          <div>Время: <select onChange={handleChange} defaultValue={"disabled"} required>
            <option value={"disabled"} disabled>Выберите время</option>
            {times}
          </select></div>
          <input className={"auth-form-button fixed-size"} type={"submit"} value={"Ok"}/>
        </div>
      </form>
    </div>
  );
}