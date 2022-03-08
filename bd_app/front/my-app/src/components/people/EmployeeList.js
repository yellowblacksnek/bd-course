import ListPage from "../ListPage";
import ResourceService from "../../services/ResourceService";
import {useEffect, useState} from "react";

export default function EmployeeList() {
  // const [items, setItems] = useState([]);
  // const [page, setPage] = useState({number: 0});
  //
  // useEffect(() => {
  //   handlePageChange(0);
  // }, []);
  // const handlePageChange = (page) => {
  //   ResourceService.loadResource('employees', page, 20).then( res => {
  //     setItems(res.items);
  //     setPage(res.page)
  //   });
  // }

  const handlePageChange = (page) => (
    ResourceService.getResource( 'employees',
      {page: page, size: 20}
    ))

  return (
    <ListPage getData={handlePageChange}/>
  );
}