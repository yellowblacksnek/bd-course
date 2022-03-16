import ResourceService from "./ResourceService";

class VisaChecksService {
  loadVisaChecks() {
    return ResourceService.getResource( `employees/${localStorage.getItem("employee")}/visaChecks`, 'visaChecks',
      {projection:"inline"}
    ).then( res => {
        res.items = res.items
          .filter(e => e.isFinished === false).map(e => ({
            id: e.id, application: e.visaAppId
          }));
        return res;
      }
    )}

  finishCheck(body) {
    return ResourceService.postResource(`visaApplications/finishCheck`, body)
  }

  deleteCheck(id) {
    return ResourceService.postResource(`visaApplications/deleteCheck`, {id});
  }

  createCheck(id) {
    return ResourceService.postResource(`visaApplications/createCheck`,
      {employee: localStorage.getItem("employee"), app_id: id});
  }

  loadApplication(id) {
    return ResourceService.getResourceRaw(`visaChecks/${id}`, {projection: "inline"})
      .then(res => {
        return (res.data.visaApp);
      }).catch(err => {
        console.log('unable to load application: ' + err.response.data)
    })
  }

  loadEmployeesDivs (id) {
    return ResourceService.getResourceRaw(`visaChecks/${id}/employees`, {projection: "inline"})
      .then(res => {
        console.log(res.data)
        const employees = res.data["_embedded"]['employees']
          .map(i => ({id: i.id, firstName: i.person.firstName, lastName: i.person.lastName}));
        return employees.map(i => <div key={i.id}>{i.firstName} {i.lastName}</div>);
      });
  }

  loadApplications(page,sort,search) {
    return ResourceService.getResourceSearch( 'visaApplications',
      {...search, visaAppState: "awaits_review"}, {page,sort}
    ).then( res => {
        res.items = res.items
          .map(i => ({
            id: i.id, person: `[${i.person.id}] ${i.person.firstName} ${i.person.lastName}`, applicationDate: i.applicationDate, startDate: i.startDate, expDate: i.expDate, trans: i.trans
          }));
        return res;
      }
    );
  }
}

export default new VisaChecksService();