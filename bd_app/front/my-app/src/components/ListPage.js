import '../styles/ListPage.css'
import React from "react";
import axios from 'axios';
import ListHeader from "./ListHeader";
import ResourceService from "../services/ResourceService";

function ListItem(props) {
  // console.log(Object.values(props.item));
  const fields = props.columns.map(
    (el) => {
      let value = String(props.item[el]);
      value = value != "null" ? value : "none";
      return <td key={el}>{value}</td>;
    }
  );

  const handleClick = (event) => {
    props.clickHandler(props.item);
  };

  return (
    <tr className="list-item" onClick={handleClick}>
      {fields}
    </tr>
  );
}

class List extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      columns: []
    }
  }

  render() {
    if(this.props.items.length > 0) {


      const columns = Object.keys(this.props.items[0]).filter(
        (el) => !el.startsWith("_"));
      const listItems = this.props.items.map((item) =>
        <ListItem key={item.id}
                  columns={columns}
                  item={item}
                  clickHandler={this.props.itemClickHandler}/>);
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
                    canAdd={this.props.canAdd}
        />
        <List items={this.state.items}
              itemClickHandler={this.props.itemClickHandler}/>
      </div>
    );
  };
}

export default ListPage;