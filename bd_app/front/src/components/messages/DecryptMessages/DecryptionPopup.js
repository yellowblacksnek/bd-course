import {useState} from "react";
import ListPage from "../../list/ListPage";

export default function DecryptionPopup(props) {
  const [currentItem, setCurrentItem] = useState();

  // const loadData = page => MessagesService.getMessagesByState(page, 'received');
  return (
    <div className="list-popup">
      <div className="messages-popup-list-wrapper">
        <ListPage
          // key={update}
          getData={props.getData}
          itemClickHandler={setCurrentItem}
        />
      </div>
      {/*<div>*/}
      <button className={"auth-form-button fixed-size"} onClick={()=>{if(currentItem) props.onSubmit(currentItem);}}>Ok</button>
      {/*</div>*/}
    </div>
  );
}