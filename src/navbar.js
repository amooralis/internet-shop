import './App.css';
import basket from "./basket.png"
import orders from "./order.png"
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";

export default function Navbar() {

    const navigate = useNavigate();
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || {products: []});

    // Функция для обновления корзины из localStorage
    const updateCartFromLocalStorage = () => {
        const updatedCart = JSON.parse(localStorage.getItem('cart')) || {products: []};
        setCart(updatedCart);
    };

    useEffect(() => {
        updateCartFromLocalStorage();
    }, [localStorage.getItem('cart')]);

    const redirectToCart = () => {
        navigate('/cart');
    };

    const redirectToMain = () => {
        navigate('/');
    }





    return (
        <nav className="navbar">
            <a><h2 onClick={redirectToMain}>Shop.</h2></a>


            <a className="cart-nav-container">
                <img onClick={redirectToCart} src={basket} alt="картинка"/>
                <p className="cart-bubble">{cart.products.reduce((acc, product) => acc + product.quantity, 0)}</p>
            </a>
        </nav>
    )
}

