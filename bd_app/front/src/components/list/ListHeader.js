import React, {useEffect, useRef, useState} from "react";
import '../../styles/ListPage.css';
import toast from "react-hot-toast";

export default function ListHeader(props) {
  const [searchQuery, setSearchQuery]= useState("");
  const searchInput = useRef(null);
  const onPageChange =(isForward) =>{
    if(!props.page) return;
    let number = props.page.number;

    if(isForward) number = Math.min(number+1, props.page.totalPages-1);
    else number = Math.max(0, number-1);

    if(number !== props.page.number)
      props.pageChangehandler(number);
  }

  const pageTracker = ()=> {
    if(props.page && props.page.totalPages)
      return (
        <div>
          <button className="list-header-button" onClick={() => onPageChange(false)} title="На страницу назад">{"<"}</button>
          <button className="list-header-button" onClick={() => onPageChange(true)} title="На страницу вперед">{">"}</button>
          {props.page.number+1} из {props.page.totalPages}.
        </div>
      );
  }

  // useEffect(searchInput.current ? searchInput.current.setCustomValidity("") : ()=>{}, [props.activeColumn])

  const handleSearchClick = () => {
    if(!props.searchHandler) return;

    if(props.validSearchValues) {
      for (let k of Object.keys(props.validSearchValues)) {
        console.log('b0', k, props.validSearchValues)
        if (k === props.activeColumn) {
          console.log('b1', k, props.activeColumn)
          let val = props.validSearchValues[k];
          console.log('b2', val)
          if (Array.isArray(val)) {
            if (!val.includes(searchQuery)) {
              console.log('b3',!val.includes(searchQuery) )
              setSearchValidity("Недопустимое значение");
              return;
            }
          } else if (typeof val === 'string') {
            let re = new RegExp(val);
            if (re.search(searchQuery) === -1) {
              setSearchValidity("Недопустимое значение");
              return;
            }
          }
          break;
        }
      }
    }
    // if(!props.activeColumn) toast.error('Для поиска выберите колонку', {duration: 800})
    else props.searchHandler(searchQuery).catch(res => {
        console.log(res)
        setSearchValidity("Недопустимое значение");
        searchInput.current.reportValidity();
    });
  }

  const setSearchValidity = (error) => {searchInput.current.setCustomValidity(error)}

  const search = ()=> {
    if(props.searchHandler)
      return (
        <div className="search-group">
          <form style={{display: "inline"}} onSubmit={e => {e.preventDefault(); handleSearchClick()}}>
            <input className="search-textinput" ref={searchInput} type="text" onChange={event=>setSearchQuery(event.target.value)} value={searchQuery} required/>
            {/*<button onClick={handleSearchClick}>Найти</button>*/}
            {/*<input className="search-button" type="submit" value="Найти" onClick={()=>setSearchValidity('')}/>*/}
            <button className="list-header-button" type="submit" onClick={()=>setSearchValidity('')}>&#x1F50E;&#xFE0E;</button>
          </form>
          <button className="list-header-button" style={{display: "inline"}} onClick={() => {props.searchHandler({}); setSearchQuery("")}}>⛒</button>
          {/*<span className="search-error-message">Недопустимое значение</span>*/}
        </div>
  );
  }

  const addButton = () => {
    if(props.addHandler) {
      return <button className="list-header-button" onClick={() => props.addHandler()} title="Добавить">➕</button>
    } else {
      return ''
    }
  }

  const removeButton = () => {
    if(props.removeHandler) {
      return <button className="list-header-button" onClick={() => props.removeHandler()} title="Удалить">&#x2796;</button>
    } else {
      return ''
    }
  }

  function editButton() {
    if(props.editHandler) {
      return <button className="list-header-button" onClick={() => props.editHandler()} title="Изменить">🖉</button>
    } else {
      return ''
    }
  }

  function refreshButton() {
    return <button className="list-header-button" onClick={() => props.pageChangehandler(props.page.number)} title="Обновить">🗘</button>
  }

  return (
    <div className="list-header">
      {pageTracker()}
      {addButton()}
      {removeButton()}
      {editButton()}
      {refreshButton()}
      {search()}
    </div>
  );
}