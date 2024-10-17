import './App.css';
import basket from "./basket.png"
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";

export default function Navbar() {

    const navigate = useNavigate();
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || {products: []});
    // let localstorageCart = localStorage.getItem('cart')
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

            <a className="nav__cart__container">
            <div className="nav__cart__img__container">
                <img onClick={redirectToCart} src={basket} alt="корзина"/>
                <p className="nav__cart__bubble">{cart.products.reduce((acc, product) => acc + product.quantity, 0)}</p>
            </div>
            <p className="nav__cart__cost"><b>{cart.products.reduce((acc, product) => acc + product.cost * product.quantity, 0)} руб.</b>
            </p>
            </a>
        </nav>
    )
}

