import ResourceService from "./ResourceService";


class EmployeesService {
  getAllEmployees(page, sort, search) {
    let res;
    if(!search)
      res = ResourceService.getResource('employees', 'employees',{page: page, size: 20, sort: sort, projection: "inline"})
    else
      res = ResourceService.getResourceSearch( 'employees',search,{page: page, size: 20, sort: sort})
    return res.then(res => {
      res.items = res.items.map(i=>({
        id:i.id, personId: `[${i.person.id}] ${i.person.firstName} ${i.person.lastName}`,
        accLvl: i.accLvl, employmentDate: i.employmentDate,
        departments: i.positions.map(p=>p.department)}));
      res.items.forEach(i=>{delete i.positions});
      return res;
    })
  }

  postEmployee(body) {
    return ResourceService.postResource('employees/create', body);
  }

  getPositionsByDepartment(department) {
    return ResourceService.getResourceRaw("positions/search/findByDepartment", {department})
      .then(res=> res.data["_embedded"]["positions"])
  }

  updateEmployee(id, body) {
    return ResourceService.updateResource(`employees/${id}`, body);
  }

}

export default new EmployeesService();