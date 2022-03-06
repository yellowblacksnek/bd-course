import ListPage from "./ListPage";
import ResourceService from "../services/ResourceService";
import {useEffect, useState} from "react";

export default function PeopleList() {
  // const [items, setItems] = useState([]);
  // const [page, setPage] = useState({number: 0});
  //
  // useEffect(() => {
  //   handlePageChange(0);
  // }, []);
  // const handlePageChange = (page) => {
  //   ResourceService.loadResource('people', page, 20).then( res => {
  //     setItems(res.items);
  //     setPage(res.page)
  //   });
  // }

  const handlePageChange = (page) => (
      ResourceService.getResource( 'people',
        {page: page, size: 20}
      ))

  return (
    // <ListPage onPageChange={handlePageChange}
    //           items={items}
    //           page={page}
    // />
    <ListPage getData={handlePageChange}/>
  );
}