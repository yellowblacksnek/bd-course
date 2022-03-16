import React, {useState} from "react";
import ListItem from "./ListItem";

export default function List(props){
  const [columns, setColumns] = useState([]);
  const [active, setActive] = useState();
  const [activeColumn, setActiveColumn] = useState();
  const [lastSort, setLastSort] = useState();
  const handleItemClick = (item) => {
    if(props.itemClickHandler)
      props.itemClickHandler(item);

    setActive(item.id);
  }

  const render = () => {
    if(props.items.length > 0) {


      const columns = Object.keys(props.items[0]).filter(
        (el) => !el.startsWith("_"));
      const listItems = props.items.map((item) =>
        <ListItem key={item.id}
                  active={active}
                  columns={columns}
                  item={item}
                  clickHandler={handleItemClick}/>);
      const getSortClass = (event, column) => {
        // console.log(props.sort, column)
        if(lastSort && lastSort !== column) {
          document.getElementById(`${lastSort}_arrow`)
            .classList.remove("up", "down", "active");
        }
        if(props.sort && props.sort.column === column) {
          if(props.sort.order === 'asc') {
            event.target.classList.remove("up");
            event.target.classList.add("down", "active");
          } else {
            event.target.classList.remove("up", "down", "active");
          }
        } else {
          event.target.classList.remove("down");
          event.target.classList.add("up", "active");
        }
        setLastSort(column);
        props.sortHandler(column);
      }
      const columnNamesCells = columns
        .filter(i => !i.startsWith('_'))
        .map(i => (props.nameMap && props.nameMap[i] ? {orig: i, mapped:props.nameMap[i]} : {orig:i, mapped: null}))
        .map(({orig, mapped}) =>
          <th className="column_title"
              key={orig}
              id={orig}
              style={props.columnWidths && props.columnWidths[orig] ? {minWidth: props.columnWidths[orig]} : {}}
              onClick={e => handleColumnClick(e, orig)}
          >
            {mapped || orig}
            {props.notSortable && props.notSortable.includes(orig) ? '' : <span id={`${orig}_arrow`} className="arrow" onClick={e => getSortClass(e, orig)}/>}
          </th>
        );
      const handleColumnClick = (e, column) => {
        if(!e.target.classList.contains("column_title")) return;
        if(!props.columnClickHandler) return;
        if(props.activeColumn && activeColumn) {
          activeColumn.classList.remove("active");
        }
        setActiveColumn(e.target)
        e.target.classList.add("active");
        props.columnClickHandler(column);
      }
      return (
        <div className="list-container">
          <div className="list-content">
            <table className="list-table">
              <thead style={{height: "40px"}}>
              <tr style={{height: "40px"}}>
                {columnNamesCells}
              </tr>
              </thead>
              <tbody>
              {!props.listEmpty && listItems}
              </tbody>
            </table>
            {props.listEmpty ? <div className="list-empty-message">Пусто</div> : ''}
          </div>
        </div>
      );
    } else {
      return (
        <div className="list-container-empty">
          <div className="list-content-empty">

          </div>
        </div>
      );
    }
  }

  return render();
}