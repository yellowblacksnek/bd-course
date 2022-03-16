import '../../styles/ListPage.css'
import React, {useEffect, useState} from "react";
import axios from 'axios';
import ListHeader from "./ListHeader";
import ResourceService from "../../services/ResourceService";
import List from "./List";

function ListPage(props) {
    const [state, setState] = useState({
      items: [],
      listEmpty: false,
      page: {},
      loading: true,
      sort: {
        column: "",
        order: ""
      },
      activeColumn: '',
      search: ''
    })

  useEffect(() => {handlePageChange(0)}, [])
  // useEffect(() => {console.log('hook', state)}, [state])


  const handlePageChange = (page, sort, search) => {
    let sortStr;
    if(sort && !sort.order) {sortStr = ''; sort = {}}
    else if(sort && sort.column && sort.order) sortStr = getSortString(sort);
    else sortStr = getSortString(state.sort);

    if(!search) search = state.search;
    else if(search.discard) search = '';
    // console.log('handlePageChange1', sortStr)
    return props.getData(page, sortStr, search).then( res => {
      res.loading = false;
      res.sort = sort || state.sort;
      res.search = search;
      res.listEmpty = false;
      if(res.items.length === 0 && state.items.length !== 0) {
        res.listEmpty = true;
        res.items = state.items;
      }
      // console.log('handlePageChange', state)
      setState({...state, ...res});
    });
  }

  const getSortString =(obj) => {return obj && obj.order ? `${obj.column},${obj.order}` : ''};
  const handleSort =(column) => {
    let currentOrder = state.sort.order;
    let currentColumn = state.sort.column;
    let sort;
    let newOrder;

    if(column === currentColumn && currentOrder === 'desc') sort = {column};
    else {
      newOrder = (column === currentColumn ? (currentOrder === "asc" ? "desc" : "asc") : "asc");
      sort = {column: column, order: newOrder};
    }
    // setState({...state, sort});
    // console.log(column, currentOrder, currentColumn, newOrder, sort,"hihihi") //`${sort.column},${sort.order}`
    return handlePageChange(0, sort, state.search)
  }

  const handleColumnClick = (column) => {setState({...state, activeColumn: column})}
  const handleSearch = (query) => {
    if(!state.activeColumn) state.activeColumn = 'id';
    let search = {};
    if(typeof query === 'object')  {
      setState({...state, activeColumn: ''});
      search.discard = true;
    }
    else {
      search[`${state.activeColumn}`] = query;
      console.log(search);
    }
    return handlePageChange(0, state.sort, search);
  }

    return (
      <div className="listpage-container">
        <ListHeader pageChangehandler={handlePageChange}
                    page={state.page}
                    addHandler={props.addHandler}
                    removeHandler={props.removeHandler}
                    editHandler={props.editHandler}
                    searchHandler={props.noSearch ? '' : handleSearch}
                    activeColumn={state.activeColumn}
                    validSearchValues={props.searchValues}
        />
        {
          state.items.length < 1 ? <ListPlaceholder loading={state.loading}/> :
          <List items={state.items}
                listEmpty={state.listEmpty}
                columnWidths={props.columnWidths}
                nameMap={props.nameMap}
                sort={state.sort}
                sortHandler={handleSort}
                notSortable={props.notSortable}
                activeColumn={state.activeColumn}
                columnClickHandler={handleColumnClick}
                itemClickHandler={props.itemClickHandler}/>
        }
      </div>
    );
}

function ListPlaceholder({loading}) {

  return (
    <div className="list-placeholder-container">
      <div className="list-placeholder">
        {
          loading ? 'Загрузка...' : 'Пусто'
        }
      </div>
    </div>
  );
}

export default ListPage;