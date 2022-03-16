import {useState} from "react";
import ListPage from "../../list/ListPage";
import ResourceService from "../../../services/ResourceService";
import {ActionPage} from "../../ActionPage";

export default function AllViolationChecksList(props) {
  const [update, setUpdate] = useState();

  const list = () =>
    <div style={{height: "100%"}}>
      <ListPage
        getData={(page,sort,search)=>ResourceService.getResource('violationChecks', 'violationChecks', {page,sort,search})}
        />
    </div>
  return (
    <ActionPage
      key={update}
      list={list()}/>

  );
}