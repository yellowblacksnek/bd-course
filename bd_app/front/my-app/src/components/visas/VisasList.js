import ListPage from "../ListPage";
import ResourceService from "../../services/ResourceService";
import {ActionPage} from "../ActionPage";

export default function VisasList() {
  const handlePageChange = (page) => (
    ResourceService.getResource( 'visas',
      {page: page, size: 20}
    ))

  const list = () => <ListPage getData={handlePageChange}/>

  return (
    <ActionPage
      list={list()}/>

  );
}