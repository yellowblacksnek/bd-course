import ListPage from "../../list/ListPage";
import ResourceService from "../../../services/ResourceService";
import {ActionPage} from "../../ActionPage";
import {useEffect, useState} from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import {today} from "../../Utils";
import PeopleService from "../../../services/PeopleService";
import VisaService from "../../../services/VisaService";

export default function VisasList() {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState(Date.now());
  const [popupActive, setPopupActive] = useState(false);

  const loadVisas = (page,sort,search) => (ResourceService.getResource( 'visas','visas', {page, sort, search}))
  const handleAdd = () => {

  }

  const handlePopupSubmit = () => {
    setPopupActive(false);
    setUpdate(Date.now())
  }

  const list = () =>
    <div style={{height: "100%"}}>
      <Modal
        isOpen={popupActive}
        onRequestClose={()=>{setPopupActive(false)}}
        className={'popup'}
        overlayClassName={'popup-container'}
      >
        <NewVisaPopup item={currentItem} stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>
      </Modal>
      <ListPage
        getData={loadVisas}
        addHandler={()=>setPopupActive(true)}
      />
    </div>

  return (
    <ActionPage
      key={update}
      list={list()}/>

  );
}

function NewVisaPopup(props) {
  const [currentItem, setCurrentItem] = useState();

  const submit = () => {
    if(!currentItem) return;
    ResourceService.postResource(`visas/create`,
      {application: currentItem.id}
    ).then(res => {
      toast.success("Виза создана!");
      props.onSubmit()
    }).catch(err => {toast.error("Не получилось создать визу")});
  }

  return (
    <div className="list-popup" style={{minWidth: "800px"}}>
      <div className="messages-popup-list-wrapper">
        <ListPage
          // key={update}
          columnWidths={{person: 200}}
          getData={VisaService.getReadyApplications}
          itemClickHandler={setCurrentItem}
        />
      </div>
      <div>
        <button className={"auth-form-button fixed-size"} onClick={submit}>Ok</button>
      </div>
    </div>
  );
}