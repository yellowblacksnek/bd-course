import '../../styles/AuthPage.css'
import {Link, useNavigate} from "react-router-dom";
import AuthService from "../../services/AuthService";
import {useState} from "react";


export default function LoginPage(props) {
  const [state, setState] = useState({})
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleChange = (event) => {
    state[event.target.name] = event.target.value;
    setState({...state});
  }

  const submit = (event) => {
    event.preventDefault();
    if(!state.username || !state.password) return;

    AuthService.login(state.username, state.password)
      .then(() => {
        navigate('/');
      }).catch(err => {
        setError(true)
    });
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        {/*<div>*/}
        <div className="auth-form-header">Войти</div>
        <div className={"auth-form-error"+(error ? " active" : "")}>Не удалось залогиниться</div>
          <form className="auth-form" onSubmit={submit}>
            <input className="auth-form-field" type='text' name="username" placeholder="Логин" onChange={handleChange}/>
            {/*<label htmlFor="username">Username</label>*/}
            <input className="auth-form-field" type='text' name="password" placeholder="Пароль" onChange={handleChange}/>
            {/*<label htmlFor="password">Password</label>*/}
            <input className="auth-form-button" type='submit' value='Войти'/>
            <Link to={"/register"} className='small-link'>Регистрация</Link>
          </form>
        {/*</div>*/}
      </div>
    </div>
  );
}