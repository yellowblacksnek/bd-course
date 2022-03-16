import ResourceService from "./ResourceService";


class PeopleService {
  getAllPeople(page, sort, search) {
    if(!search)
      return ResourceService.getResource('people', 'people',{page, sort})
    else
      return ResourceService.getResourceSearch('people', search, {page, sort})
  }

  postPerson(body) {
    return ResourceService.postResource('people', body);
  }

  updatePerson(id, body) {
    return ResourceService.updateResource(`people/${id}`, body);
  }

  getRecruitPeople(page, sort, search, knows) {
    let res;
    // if(!search) res = ResourceService.getResource('people/searchBy', 'people',
    //   {page: page, size: 20, sort: sort, knows, counterpart:"notnull" });
     res = ResourceService.getResourceSearch( 'people', search,
       {page: page, size: 20, sort: sort, knows, counterpart:"notnull", birthDim:localStorage.getItem("dimension")});
    return res.then(res => {
    const items = res.items.map(i => ({id: i.id, firstName: i.firstName, lastName: i.lastName, birthDate: i.birthDate, birthDim: i.birthDim, knows: i.knows, counterpart: i.counterpart}))
    return {items, page:res.page}
    })
  }
}

export default new PeopleService();