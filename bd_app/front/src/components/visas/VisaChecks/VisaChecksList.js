import '../../../styles/ChecksPages.css'

import ListPage from "../../list/ListPage";
import {ActionPage} from "../../ActionPage";
import {useEffect, useState} from "react";
import Modal from 'react-modal';
import VisaChecksService from "../../../services/VisaChecksService";
import VisaChecksPopup from "./VisaChecksPopup";
import VisaCheckContent from "./VisaCheckContent";
import VisaChecksForm from "./VisaCheckForm";
import CheckPopup from "../CheckPopup";

export default function VisaChecksList(props) {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState();
  const [popupActive, setPopupActive] = useState(false);

  const submitForm = (data) => {
    if(!currentItem) return new Promise(() => false);
    const body = {
      id:currentItem.id,
      verdict:data.verdict,
      comment: data.comment || ' '
    }

    return VisaChecksService.finishCheck(body)
      .then(res => {
          setCurrentItem();
          setUpdate(Date.now());
      });
  }

  const handleAdd = () => {
    setPopupActive(true);
  }

  const handleRemove = () => {
    if(!currentItem) return;
    VisaChecksService.deleteCheck(currentItem.id)
      .then(res => {
          setCurrentItem();
          setUpdate(Date.now());
      });
  }

  const list = () =>
    <div style={{height: "100%"}}>
      <Modal
        isOpen={popupActive}
        onRequestClose={()=>{setPopupActive(false)}}
        className={'popup'}
        overlayClassName={'popup-container'}
      >
        <CheckPopup stateHandler={setPopupActive}
                    onSubmit={handlePopupSubmit}
                    createCheck={VisaChecksService.createCheck}
                    loadItems={VisaChecksService.loadApplications}
        />

      </Modal>
      <ListPage
        // key={update}
        notSortable={["id", "application"]}
        noSearch={true}
        nameMap={{id: "ID проверки", application: "ID заявления"}}
        getData={VisaChecksService.loadVisaChecks}
        itemClickHandler={setCurrentItem}
        addHandler={handleAdd}
        removeHandler={handleRemove}
      />
    </div>
  const handlePopupSubmit = () => {
    setPopupActive(false);
    setUpdate(Date.now());
  }

  return (
    <ActionPage
      key={update}
      displayedContent={<VisaCheckContent currentItem={currentItem}/>}
      list={list()}
      form={<VisaChecksForm onSubmit={submitForm}/>}/>
  );
}