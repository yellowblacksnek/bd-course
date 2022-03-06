export function ActionPage(props) {
  // const [update, setUpdate] = useState(Date.now());

  // const submitForm = (data) => {
  //   console.log(data.sender, data.recipient, data.content);
  //   if(Object.keys(props.currentItem).length < 1) return false;
  //   data.id = props.currentItem.id;
  //   return props.onSubmit(data).then(res=> {
  //       if(res) {
  //         console.log(res)
  //         props.setCurrentItem({});
  //         setUpdate(Date.now());
  //         return true;
  //       }
  //   });
  // }

  // const messageContent = () => {
  //   if(Object.keys(currentItem).length > 0)
  //     return (
  //       <div>
  //         Текст сообщения [{currentItem.id}]:
  //         <div className="msg-processing-message">
  //           {currentItem[props.displayedColumn]}
  //         </div>
  //       </div>
  //     );
  //   else return (
  //     <div>
  //       Выберите сообщение из списка
  //     </div>
  //   );
  // }

  const content = props.displayedContent ?
    <div className="action-content-container">
      {props.displayedContent()}
    </div>
    : '';


  return (
    <div className="action-container">
      <div className="action-task">
        <div className="action-list-container">
          <div className="action-list">
            {/*<ListPage*/}
            {/*  // key={update}*/}
            {/*  getData={props.handlePageChange}*/}
            {/*  clickHandler={handleItemClick}*/}
            {/*/>*/}
            {props.list}
          </div>
        </div>
        {content}
      </div>
      <div className="action-result">
        {props.form}
      </div>
    </div>
  );
}