import axios from "axios";
import authHeader from "./AuthHeader";

const API_URL = 'http://localhost:8080/api/';
// const DEFAULT_PAGE = 0;
// const DEFAULT_SIZE = 20;

class ResourceService {
  getResourceRaw(uri, params = {}) {
    // console.log(params)

    let url = API_URL + uri;
      //?page=${page}&size=${size}&sort=${sort}`;
    if(!!Object.keys(params).length) {
      url = url + `?`;
      for (let p of Object.keys(params)) {
        url = url + `${String(p)}=${String(params[p])}&`
      }
    }
    // console.log(url)
    return axios.get(url,
      {auth: authHeader()}
    );
  }

  getURI(name, id) {
    return `${API_URL}${name}/${id}`
  }

  getResource(uri,name, params) {
    if(typeof name === 'object') {
      params = name;
      name = uri;
    }
    if(params.search) {
      let search = params.search;
      delete params.search;
      return this.getResourceSearch(name, search, params)
    }
    return this.getResourceRaw(uri, params)
      .then( res => {
          let items = res.data["_embedded"][name];
          let page = res.data.page;
        return {items, page};
        }
      );
  }

  getResourceSearch(name, search, params) {
    return this.getResourceRaw(`${name}/searchBy`, {...search, ...params})
      .then( res => {
        // console.log(res)
          let items = res.data.content;
          let page = {
            number: res.data.number,
            totalPages: res.data.totalPages,
            size: res.data.size,
            totalElements: res.data.totalElements
          };
        console.log({items, page})
        return {items, page};
        }
      );
  }

  postResource(name, body) {
    return axios.post(API_URL+name,
      body,
      {auth: authHeader()}
    );
  }

  updateResource(name, body) {
    return axios.patch(API_URL+name,
      body,
      {auth: authHeader()}
    );
  }

  //curl -i -X PATCH -H "Content-Type: text/uri-list" -u user:password -d "http://localhost:8080/api/employees/1008" http://localhost:8080/api/visaChecks/2/employees
  addSubResource(name, newResource) {
    return axios({
      method: 'patch',
      url: API_URL+name,
      headers: { 'Content-Type': 'text/uri-list' },
      data: API_URL+newResource,
      auth:authHeader()
    })
  }

  deleteResource(uri) {
    return axios.delete(API_URL+uri, {auth:authHeader()});
  }

}

export default new ResourceService();