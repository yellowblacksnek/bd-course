import axios from "axios";

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
        if (response.status === 200) {
          localStorage.setItem("user", JSON.stringify({username, password}));
          localStorage.setItem("roles", JSON.stringify(response.data.authorities));
          localStorage.setItem("employee", JSON.stringify(response.data.employeeId));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
    localStorage.removeItem("employee");
  }

  register(username, emplId, password) {
    return axios.post(API_URL + "register", {
      username,
      emplId,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
    ;
  }

}

export default new AuthService();