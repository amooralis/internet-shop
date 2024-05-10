import axios from "axios";
import './App.css';

function login_user() {
    const username = document.getElementById("login-input").value;
    const password_1 = document.getElementById("password-input").value;
    const tryUser = {
        username: username, password: password_1
    }
    axios.post("http://localhost:3456/login", tryUser, {
        method: "POST", headers: {
            "Content-Type": "application/json",
        }
    })
        .then((response) => {
            window.location.href = `http://localhost:3000/`;
            localStorage.setItem("userId", response.data.id);
        })
        .catch((error) => {
            alert("Неверный логин или пароль")
            console.error("Ошибка при входе.", error);
        });
}

export default function Login() {
    return (<div className="form">
        <div className="sign-up">
            <label>Login</label>
            <input id="login-input"/>
            <label>Password</label>
            <input type="password" id="password-input"/>
            <p>New to our shop? <a href="http://localhost:3000/signup">Create an account</a></p>
            <button onClick={login_user}>Login</button>
        </div>
    </div>);
}


