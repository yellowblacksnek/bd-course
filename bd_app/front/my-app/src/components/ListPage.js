import '../styles/ListPage.css'
import React, {useState} from "react";
import axios from 'axios';
import ListHeader from "./ListHeader";
import ResourceService from "../services/ResourceService";

function ListItem(props) {
  // console.log(Object.values(props.item));
  const fields = props.columns.map(
    (el) => {
      let value = String(props.item[el]);
      value = value != "null" ? value : "none";
      // value = value.length > 30 ? value.substring(0, 30)+'...':value;
      return <td key={el}>{value}</td>;
    }
  );

  const handleClick = (event) => {
    if(props.clickHandler)
      props.clickHandler(props.item);
  };

  const itemClassName = props.active === props.item.id ?
    "list-item active" : "list-item";

  return (
    <tr className={itemClassName} onClick={handleClick}>
      {fields}
    </tr>
  );
}

function List(props){
  const [columns, setColumns] = useState([]);
  const [active, setActive] = useState();

  const handleItemClick = (item) => {
    if(props.itemClickHandler)
      props.itemClickHandler(item);

    setActive(item.id);
  }

  const render = () => {
    if(props.items.length > 0) {


      const columns = Object.keys(props.items[0]).filter(
        (el) => !el.startsWith("_"));
      const listItems = props.items.map((item) =>
        <ListItem key={item.id}
                  active={active}
                  columns={columns}
                  item={item}
                  clickHandler={handleItemClick}/>);
      const columnNamesCells =columns.map((col) =>
        <th key={col} style={{height: "40px"}}>{col}</th>
      );
      return (
        <div className="list-container">
          <div className="list-content">
            <table className="list-table">
              <thead style={{height: "40px"}}>
              <tr style={{height: "40px"}}>
                {columnNamesCells}
              </tr>
              </thead>
              <tbody>
              {listItems}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else {
      return (
        <div className="list-container-empty">
          <div className="list-content-empty">

          </div>
        </div>
      );
    }
  }

  return render();
}

class ListPage extends React.Component{
  constructor(props) {
    super(props);
    this.handlePageChange = this.handlePageChange.bind(this);

    this.state = {
      items: [],
      page: {}
    }
  }

  componentDidMount() {
    console.log('listPage mounted');
    // if(this.props.name != "none")
      this.handlePageChange(0);
  }
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if(prevProps.name !== this.props.name || this.props.name === "none")
  //     ResourceService.loadResource(this.props.name, 0, 20).then( res => {
  //       this.setState(res);
  //     });
  // }
  handlePageChange(page) {
    this.props.getData(page).then( res => {
      this.setState(res);
    });
  }
  render() {
    return (
      <div className="listpage-container">
        <ListHeader pageChangehandler={this.handlePageChange}
                    page={this.state.page}
                    addHandler={this.props.addHandler}
                    removeHandler={this.props.removeHandler}
        />
        <List items={this.state.items}
              itemClickHandler={this.props.itemClickHandler}/>
      </div>
    );
  };
}

export default ListPage;