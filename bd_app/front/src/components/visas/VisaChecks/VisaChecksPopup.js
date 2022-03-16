import {useState} from "react";
import VisaChecksService from "../../../services/VisaChecksService";
import toast from "react-hot-toast";
import ListPage from "../../list/ListPage";

export default function VisaChecksPopup(props) {
  const [currentItem, setCurrentItem] = useState();

  const submit = () => {
    if(!currentItem) return;
    VisaChecksService.createCheck(currentItem.id).then(res => {
      toast.success("Проверка выполнена!");
    });
  }

  return (
    <div className="list-popup" style={{minWidth: "800px"}}>
      <div className="messages-popup-list-wrapper">
        <ListPage
          // key={update}
          columnWidths={{person: 200}}
          getData={VisaChecksService.loadApplications}
          itemClickHandler={setCurrentItem}
        />
      </div>
      <div>
        <button className={"auth-form-button fixed-size"} onClick={submit}>Ok</button>
      </div>
    </div>
  );
}