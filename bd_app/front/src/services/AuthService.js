import axios from "axios";
import authHeader from "./AuthHeader";
import ResourceService from "./ResourceService";

const API_URL = "http://localhost:8080/api/";

class AuthService {
  login(username, password) {
    return axios
      .get(API_URL + "login", {
        auth: {
          username,
          password
        }
      })
      .then(response => {
        localStorage.setItem("user", JSON.stringify({username, password}));
        localStorage.setItem("roles", JSON.stringify(response.data.authorities));
        localStorage.setItem("employee", response.data.employeeId);

        const levels= ['restricted', 'standard', 'high', 'max'];
        let level;
        for(let i of response.data.authorities) {
          if(levels.includes(i.authority)) {
            level = i.authority;
            break;
          }
        }
        localStorage.setItem("access", level);
        return response;
      })
      .then(res => ResourceService.getResourceRaw('employees/search/getPerson', {employee:res.data.employeeId}))
      .then(res=>{
        localStorage.setItem("person", JSON.stringify(res.data));
        localStorage.setItem("dimension", res.data.birthDim);
      });
  }

  logout() {
    return axios.get(API_URL + "logout",  {auth:authHeader()}).then((res) => {
        // console.log(res)
        localStorage.removeItem("user");
        localStorage.removeItem("roles");
        localStorage.removeItem("employee");
        localStorage.removeItem("person");
        localStorage.removeItem("dimension");
        return res;
      }
    ).catch(()=>{});
  }

  register(username, password, employee) {
    return axios.post(API_URL + "register", {
      username,
      employee,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

}

export default new AuthService();