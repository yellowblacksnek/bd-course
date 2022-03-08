import axios from "axios";
import authHeader from "./AuthHeader";

const API_URL = 'http://localhost:8080/api/';
// const DEFAULT_PAGE = 0;
// const DEFAULT_SIZE = 20;

class ResourceService {
  getResourceRaw(name, params) {
    // console.log(params)

    let url = API_URL + name;
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

  getResource(name, params) {
    return this.getResourceRaw(name, params)
      .then( res => {
          let items = res.data["_embedded"][name];
          let page = res.data.page;
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

}

export default new ResourceService();