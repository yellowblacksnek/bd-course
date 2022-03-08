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
      {props.displayedContent}
    </div>
    : '';

  const form = props.form ?
    <div className="action-result">
      {props.form}
    </div>
    : '';

  const popup = () => {
    if(props.popup) {

      const handlePopupClick = (event) => {
        // console.log(event)
        if(event.target.className === 'action-popup-container active')
          props.popupStateHandler.setPopupActive(false)
      }

      // const containerClass = props.popupStateHandler.popupActive ?
      //   'action-popup-container active' :
      //   'action-popup-container';

      return (
        props.popupStateHandler.popupActive &&
        <div className='action-popup-container active' onClick={handlePopupClick}>
          <div className="action-popup">
            {props.popup}
          </div>
          {/*<div className="action-dim"></div>*/}
        </div>);
    } else return ''
  }


  return (
    <div className="action-page-container">
      {popup()}
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
        {form}
      </div>
    </div>
  );
}