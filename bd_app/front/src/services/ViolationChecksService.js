import ResourceService from "./ResourceService";

class ViolationChecksService {
  loadViolationChecks() {
    return ResourceService.getResource( `employees/${localStorage.getItem("employee")}/violationChecks`, 'violationChecks',
      {projection:"inline"}
    ).then( res => {
        res.items = res.items
          .filter(e => e.isFinished === false).map(e => ({
            id: e.id, violation: e.violationId
          }));
        return res;
      }
    )}

  finishCheck(body) {
    return ResourceService.postResource(`violations/finishCheck`, body)
  }

  deleteCheck(id) {
    return ResourceService.postResource(`violations/deleteCheck`, {id});
  }

  createCheck(id) {
    return ResourceService.postResource(`violations/createCheck`,
      {employee: localStorage.getItem("employee"), violation: id});
  }

  loadViolation(id) {
    return ResourceService.getResourceRaw(`violationChecks/${id}`, {projection: "inline"})
      .then(res => {
        return (res.data.violation);
      }).catch(err => {
        console.log('unable to load violation: ' + err.response.data)
      })
  }

  loadEmployeesDivs (id) {
    return ResourceService.getResourceRaw(`violationChecks/${id}/employees`, {projection: "inline"})
      .then(res => {
        if (res.status === 200) {
          console.log(res.data)
          const employees = res.data["_embedded"]['employees']
            .map(i => ({id: i.id, firstName: i.person.firstName, lastName: i.person.lastName}));
          return employees.map(i => <div key={i.id}>{i.firstName} {i.lastName}</div>);
        }
      });
  }

  loadViolations(page,sort,search) {
    return ResourceService.getResourceSearch( 'violations',
      {...search, violationState: "awaits_review"}, {page,sort}
    ).then( res => {
        res.items = res.items
          .map(i => ({
            id: i.id, person: `[${i.person.id}] ${i.person.firstName} ${i.person.lastName}`, violationType: i.violationType, description: i.description, issueDate: i.issueDate
          }));
        return res;
      }
    );
  }
}

export default new ViolationChecksService();