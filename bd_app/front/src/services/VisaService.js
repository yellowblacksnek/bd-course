import ResourceService from "./ResourceService";


class VisaService {

  getReadyApplications(page,sort,search) {
    return ResourceService.getResourceSearch( 'visaApplications',
      {...search, visaAppState: "ready"}, {page,sort}
    ).then( res => {
        res.items = res.items
          .map(i => ({
            id: i.id, person: `[${i.person.id}] ${i.person.firstName} ${i.person.lastName}`,
            applicationDate: i.applicationDate, startDate: i.startDate, expDate: i.expDate, trans: i.trans
          }));
        res.items.forEach(i=>{delete i.visaAppState;});
        return res;
      }
    );
  }
}

export default new VisaService();