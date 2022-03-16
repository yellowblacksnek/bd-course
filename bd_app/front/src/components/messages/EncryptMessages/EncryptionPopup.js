import {useState} from "react";
import ResourceService from "../../../services/ResourceService";
import ListPage from "../../list/ListPage";
import toast from "react-hot-toast";

export default function EncryptionPopup(props) {
  const [currentItem, setCurrentItem] = useState();

  const loadFormed = (page, sort,search) => {
    return ResourceService.getResource( 'messages','messages',
      {search:{...search, msgState: "formed"}, page,sort}
    ).then( res => {
        res.items = res.items.map(e => ({id: e.id, content: e.content}));
        return res;
      }
    );
  }

  const submit = () => {
    console.log(currentItem)
    if(!currentItem) return;
    ResourceService.updateResource(`messages/${currentItem.id}`,
      {decEmpl: localStorage.getItem("employee"), msgState: 'encrypting'}
    ).then(res => {
      toast.success("Сообщение добавлено в список")
        props.onSubmit();
    }).catch(err => {
      toast.error("Не удалось добавить сообщение")
    });
  }

  return (
    <div className="list-popup">
      <div className="messages-popup-list-wrapper">
        <ListPage
          // key={update}
          getData={loadFormed}
          itemClickHandler={setCurrentItem}
        />
      </div>
      <div>
        <button className={"auth-form-button fixed-size"} onClick={submit}>Ok</button>
      </div>
    </div>
  );
}