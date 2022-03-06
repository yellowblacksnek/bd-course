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
          Страница {props.page.number+1} из {props.page.totalPages+1}.
        </div>
      );
  }

  return (
    <div className="list-header">
      { props.canAdd &&
        <button onClick={() => onPageChange(false)}>{"+ add"}</button>
      }
      <button onClick={() => onPageChange(false)}>{"<"}</button>
      <button onClick={() => onPageChange(true)}>{">"}</button>
      {pageTracker()}

    </div>
  );
}