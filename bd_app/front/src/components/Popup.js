import '../styles/Popup.css'
export default function Popup(props) {
  const handlePopupClick = (event) => {
    // console.log(event)
    if(event.target.className === 'popup-container')
      props.popupStateHandler.setPopupActive(false)
  }

  return (
    props.popupStateHandler.popupActive &&
    <div className="popup-container" onClick={handlePopupClick}>
      <div className="popup">
        {props.body}
      </div>
    </div>
  );
}