import ListPage from "../ListPage";
import ResourceService from "../../services/ResourceService";
import {ActionPage} from "../ActionPage";

export default function ViolationsList() {
  const handlePageChange = (page) => (
    ResourceService.getResource( 'violations',
      {page: page, size: 20}
    ))

  const list = () => <ListPage getData={handlePageChange}/>

  return (
    <ActionPage
      list={list()}/>

  );
}