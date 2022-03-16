import '../../../styles/Applications.css'

import ListPage from "../../list/ListPage";
import ResourceService from "../../../services/ResourceService";
import {ActionPage} from "../../ActionPage";
import {useState} from "react";
import Modal from "react-modal";
import NewApplicationPopup from "./NewApplicationPopup";

export default function ApplicationsList() {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState(Date.now());
  const [popupActive, setPopupActive] = useState(false);

  const loadApplications = (page,sort,search) => (
    ResourceService.getResource( 'visaApplications','visaApplications',
      {page, sort, search}
    ).then(res=>{
      res.items.forEach(i => (delete i.person));
      return res;
    }))

  const handleItemClick = (item) => {setCurrentItem(item)}
  const handleAdd = () => {setPopupActive(true)}


  const list = () =>
    <div style={{height: "100%"}}>
      <Modal
        isOpen={popupActive}
        onRequestClose={()=>{setPopupActive(false)}}
        className={'popup'}
        overlayClassName={'popup-container'}
      >
        <NewApplicationPopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>
      </Modal>
      <ListPage
        notSortable={["personId"]}
        getData={loadApplications}
        addHandler={handleAdd}
        itemClickHandler={handleItemClick}
      />
    </div>

  const handlePopupSubmit = () => {
    setPopupActive(false);
    setUpdate(Date.now())
  }

  return (
    <ActionPage
      key={update}
      list={list()}
    />

  );
}