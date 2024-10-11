import './App.css';
import basket from "./basket.png"
import orders from "./order.png"
import exit from "./exit.png"
import {useNavigate} from 'react-router-dom';
import axios from "axios";

export default function Navbar() {

    const navigate = useNavigate();

    const redirectToOrders = () => {
        navigate('/orders');
    };

    const redirectToCart = () => {
        navigate('/cart');
    };

    const redirectToMain = () => {
        navigate('/');
    }

    function logout() {
        axios.get("http://localhost:3456/logout")
            .then(() => {
                localStorage.setItem("userId", null);
                navigate('/login');
            })
    }

    return (
        <div className="navbar">
            <h2 onClick={redirectToMain}>Shop.</h2>

                <img onClick={redirectToOrders} src={orders} alt="картинка"/>
                <img onClick={redirectToCart} src={basket} alt="картинка"/>
                <img onClick={logout} src={exit} alt="картинка"/>

        </div>
    )
}

