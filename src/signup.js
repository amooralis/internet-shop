import './App.css';
import axios from "axios";

function create_new_user() {
    const name = document.getElementById("name-input").value;
    const username = document.getElementById("login-input").value;
    const password_1 = document.getElementById("password-input").value;
    const password_2 = document.getElementById("second-password-input").value;

    if (password_1 === password_2) {
        const newUser = {
            name: name, username: username, password: password_1
        };

        axios.post("http://localhost:3456/signup", newUser, {
            method: "POST", headers: {
                "Content-Type": "application/json",
            }
        })
            .then((response) => {

                console.log(response.data);
                window.location.href = `http://localhost:3000/login`;
            })
            .catch((error) => {
                console.error("Error creating user.", error);
            });

    } else {
        alert("Пароли не совпадают");
    }
}


export default function SignUp() {
    return (<div className="form">
        <div className="sign-up">
            <label>Name</label>
            <input id="name-input"/>
            <label>Login</label>
            <input id="login-input"/>
            <label>Password</label>
            <input type="password" id="password-input"/>
            <label>Repeat password</label>
            <input type="password" id="second-password-input"/>
            <p>Already have an account? <a href="http://localhost:3000/login">Sign In</a></p>
            <button onClick={create_new_user}>Sign Up</button>
        </div>
    </div>);
}