import ListPage from "../list/ListPage";
import ResourceService from "../../services/ResourceService";
import {useEffect, useState} from "react";
import {ActionPage} from "../ActionPage";
import {today} from "../Utils";
import PeopleService from "../../services/PeopleService";
import Modal from "react-modal";
import toast from "react-hot-toast";
import EditPersonPopup from "./EditPersonPopup";
import NewPersonPopup from "./NewPersonPopup";

export default function PeopleList() {
  const [update, setUpdate] = useState();
  const [currentItem, setCurrentItem] = useState('')
  const [addPopupActive, setAddPopupActive] = useState(false);
  const [editPopupActive, setEditPopupActive] = useState(false);

  // const handlePageChange = (page) => (PeopleService.getAllPeople(page))
  const addSubmit = () => {setAddPopupActive(false);setUpdate(Date.now());}
  const editSubmit = () => {setEditPopupActive(false);setUpdate(Date.now());}

  const list = () =>
    <div style={{height: "100%"}}>
      <Modal
        isOpen={addPopupActive}
        onRequestClose={()=>{setAddPopupActive(false)}}
        className={'popup'}
        overlayClassName={'popup-container'}
      >
        <NewPersonPopup stateHandler={setAddPopupActive} onSubmit={addSubmit}/>
      </Modal>
      <Modal
        isOpen={editPopupActive}
        onRequestClose={()=>{setEditPopupActive(false)}}
        className={'popup'}
        overlayClassName={'popup-container'}
      >
        <EditPersonPopup item={currentItem} stateHandler={setEditPopupActive} onSubmit={editSubmit}/>
      </Modal>
      <ListPage
        columnWidths={{id: "80px", firstName: "150px", lastName: "150px"}}
        getData={PeopleService.getAllPeople}
        itemClickHandler={setCurrentItem}
        addHandler={()=>setAddPopupActive(true)}
        editHandler={()=>{if(currentItem)setEditPopupActive(true)}}
        // searchValues={{birthDim: ['alpha', 'prime']}}
      />
    </div>


  return (
    <ActionPage
      key={update}
      list={list()}
    />

  );
}