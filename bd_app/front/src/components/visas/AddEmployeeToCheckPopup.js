import {useEffect, useState} from "react";
import ResourceService from "../../services/ResourceService";
import toast from "react-hot-toast";
import ListPage from "../list/ListPage";

export default function AddEmployeeToCheckPopup(props) {
  const [currentItem, setCurrentItem] = useState();
  const [update, setUpdate] = useState(Date.now())

  const loadData = (page, sort, search) => {
    return ResourceService.getResource('employees/search/findEmployeesByDepartment', 'employees',
      {page, sort, department: props.department, projection: "inline"}
    ).then(res => {
        res.items = res.items
          .map(i => ({
            id: i.id,
            person: `[${i.person.id}] ${i.person.firstName} ${i.person.lastName}`,
            accLvl: i.accLvl,
            positions: i.positions.map(p => p.name).toString()
          }));
        return res;
      }
    );
  }

  const submit = () => {
    if (!currentItem) return;
    ResourceService.addSubResource(`${props.checkResourceName}/${props.check.id}/employees`, `employees/${currentItem.id}`)
      .then(res => {
        toast.success("Сотрудник добавлен к проверке!");
        setUpdate(Date.now())
        props.onSubmit();
      }).catch(err => {
      if (err.response.includes('unique'))
        toast.error("Сотрудник уже связан с этой проверкой!")
    })
  }

  useEffect(() => {
    console.log(currentItem)
  }, [currentItem])

  return (
    <div className="list-popup" style={{minWidth: "800px"}}>
      <div className="messages-popup-list-wrapper">
        <ListPage
          key={update}
          columnWidths={{person: 200}}
          getData={loadData}
          itemClickHandler={setCurrentItem}
        />
      </div>
      <div>
        <button className={"auth-form-button fixed-size"} onClick={submit}>Ok</button>
      </div>
    </div>
  );
}