import '../../styles/AuthPage.css'
import {Link, useNavigate} from "react-router-dom";
import AuthService from "../../services/AuthService";
import {useState} from "react";


export default function RegisterPage(props) {
  const [state, setState] = useState({})
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleChange = (event) => {
    state[event.target.name] = event.target.value;
    setState({...state});
  }

  const submit = (event) => {
    event.preventDefault();
    if(!state.username || !state.password || !state.employee) return;

    AuthService.register(state.username, state.password, state.employee)
      .then(res => navigate('/login'))
      .catch(err => {
        let msg = err.response.data.toLowerCase();
        if(msg.includes('employee')) setError('Сотрудник уже зарегистрирован!');
        if(msg.includes('username')) setError('Юзернейм уже зарегистрирован!');
        if(msg.includes('syntax')) setError('Данные введены некорректно!');

      });
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        {/*<div>*/}
        <div className="auth-form-header">Регистрация</div>
        <div className={"auth-form-error"+(error ? " active" : "")}>{error}</div>
        <form className="auth-form" onSubmit={submit}>
          <input className="auth-form-field" type='text' name="employee" placeholder="ID сотрудника" onChange={handleChange}/>
          <input className="auth-form-field" type='text' minLength={4} name="username" placeholder="Логин" onChange={handleChange}/>
          <input className="auth-form-field" type='text' minLength={4} name="password" placeholder="Пароль" onChange={handleChange}/>
          <input className="auth-form-button" type='submit' value='Подтвердить'/>
          <Link to={"/login"} className='small-link'>Войти</Link>
        </form>
        {/*</div>*/}
      </div>
    </div>
  );
}