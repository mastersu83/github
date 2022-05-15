import React from "react";
import axios from "axios";
const App = () => {
  const [user, setUser] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [userLogin, setUserLogin] = React.useState("");
  const [state, setState] = React.useState({
    isLoaded: false,
    isUser: false,
    disable: false,
    userNotFind: false,
  });

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const getUserOnClick = () => {
    setUserLogin(input);
  };

  console.log(user);

  const getUser = async () => {
    try {
      setState({
        ...state,
        isLoaded: true,
        disable: true,
        isUser: false,
        userNotFind: false,
      });
      await axios
        .get(`https://api.github.com/users/${userLogin}`)
        .then((res) => setUser(res.data));
      setState({
        ...state,
        isLoaded: false,
        disable: false,
        isUser: true,
        userNotFind: false,
      });
    } catch (e) {
      setState({ ...state, userNotFind: true, isUser: false, disable: false });
      console.log(e.message);
    }
  };

  React.useEffect(() => {
    let login = window.location.href.split("=");
    if (login[1]) {
      setUserLogin(login[1]);
      setInput(login[1]);
    }
  }, []);

  React.useEffect(() => {
    if (userLogin) {
      let pathName = `${window.location.pathname}?login=${userLogin}`;
      window.history.pushState(null, document.title, pathName);
      getUser();
    }
  }, [userLogin]);

  return (
    <div id="app">
      <div className="app-container">
        {state.isLoaded && <div>Загрузка...</div>}
        <br />
        <div className="app-form">
          <input
            onChange={handleInputChange}
            type="text"
            className="app-input"
            placeholder="Укажите GitHub-аккаунт"
            value={input}
          />
          <button
            onClick={getUserOnClick}
            disabled={state.disable}
            className={`app-form_btn ${state.disable ? "disabled" : ""}`}
          >
            Найти
          </button>
        </div>
        {state.userNotFind && <div>Пользователь не найден</div>}
        {state.isUser && (
          <div className="app-user">
            <div className="app-user_info">
              <div className="app-user_image">
                <img
                  className="app-image_avatar"
                  src={user.avatar_url}
                  alt=""
                />
              </div>
              <div className="app-user_data">
                <h1 className="app-user_name">
                  {user.name}
                  <span>@{user.login}</span>
                </h1>
                <p className="app-user_about">{user.bio}</p>
              </div>
            </div>
            <ul className="app-user_stats">
              <li className="app-user_stats-item">
                Репозитории
                <br />
                <span>{user.public_repos}</span>
              </li>
              <li className="app-user_stats-item">
                Подписчиков
                <br />
                <span>{user.followers}</span>
              </li>
              <li className="app-user_stats-item">
                Фоловеров
                <br />
                <span>{user.following}</span>
              </li>
            </ul>
            <ul className="app-user_location">
              <li className="app-user_location-item">{user.location}</li>
              <li className="app-user_location-item">
                <a href={user.html_url}>{user.html_url}</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
