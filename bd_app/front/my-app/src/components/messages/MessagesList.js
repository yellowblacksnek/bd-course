import ResourceService from "../../services/ResourceService";
import ListPage from "../ListPage";
import {ActionPage} from "../ActionPage";

export default function MessagesList() {
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
    ResourceService.getResource( 'messages',
      {page: page, size: 20}
    ))

  const list = () => <ListPage getData={handlePageChange}/>

  return (
    // <ListPage onPageChange={handlePageChange}
    //           items={items}
    //           page={page}
    // />
    <ActionPage
      // key={update}
      // popup={<DecryptionPopup stateHandler={setPopupActive} onSubmit={handlePopupSubmit}/>}
      // popupStateHandler={{popupActive, setPopupActive}}
      list={list()}/>

  );
}