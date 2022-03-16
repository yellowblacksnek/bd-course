import {useState} from "react";
import Modal from "react-modal";
import NewEmployeePopup from "../../employees/NewEmployeePopup";
import EditEmployeePopup from "../../employees/EditEmployeePopup";
import ListPage from "../../list/ListPage";
import EmployeesService from "../../../services/EmployeesService";
import {ActionPage} from "../../ActionPage";
import ResourceService from "../../../services/ResourceService";

export default function AllVisaChecksList(props) {
  const [update, setUpdate] = useState();

  const list = () =>
    <div style={{height: "100%"}}>
      <ListPage
        notSortable={['employees']}
        getData={(page,sort,search)=>
          ResourceService.getResource('visaChecks', 'visaChecks', {page,sort,search, projection: 'inline'})
            .then(res=> {
              res.items = res.items.map(i=>
                ({id: i.id, comment: i.comment, isFinished: i.isFinished, visaAppId: i.visaAppId, verdict: i.verdict, verdictDate: i.verdictDate, employees: i.employees.map(e=>e.id)}))
                return res;

            })
      }
        />
    </div>
  return (
    <ActionPage
      key={update}
      list={list()}/>

  );
}