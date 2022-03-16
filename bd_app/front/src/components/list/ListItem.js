import React from "react";

export default function ListItem(props) {
  // console.log(Object.values(props.item));
  const fields = props.columns.map(
    (el) => {
      let value = String(props.item[el]);
      value = value != "null" ? value : "none";
      // value = value.length > 30 ? value.substring(0, 30)+'...':value;
      return <td key={el} title={value}>{value}</td>;
    }
  );

  const handleClick = (event) => {
    if(props.clickHandler)
      props.clickHandler(props.item);
  };

  const itemClassName = props.active === props.item.id ?
    "list-item active" : "list-item";

  return (
    <tr className={itemClassName} onClick={handleClick}>
      {fields}
    </tr>
  );
}