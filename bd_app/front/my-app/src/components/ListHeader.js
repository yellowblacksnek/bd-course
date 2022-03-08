import React from "react";
import '../styles/ListPage.css';

export default function ListHeader(props) {
  const onPageChange =(isForward) =>{
    if(!props.page) return;
    let number = props.page.number;

    if(isForward) number++;
    else number = Math.max(0, --number);

    if(number !== props.page.number)
      props.pageChangehandler(number);
  }

  const pageTracker = ()=> {
    if(props.page && props.page.totalPages)
      return (
        <div>
          <button onClick={() => onPageChange(false)}>{"<"}</button>
          <button onClick={() => onPageChange(true)}>{">"}</button>
          Страница {props.page.number+1} из {props.page.totalPages+1}.
        </div>
      );
  }

  const addButton = () => {
    if(props.addHandler) {
      return <button onClick={() => props.addHandler()}>{"+ add"}</button>
    } else {
      return ''
    }
  }

  const removeButton = () => {
    if(props.removeHandler) {
      return <button onClick={() => props.removeHandler()}>{"- remove"}</button>
    } else {
      return ''
    }
  }

  return (
    <div className="list-header">
      {addButton()}
      {removeButton()}
      {pageTracker()}

    </div>
  );
}