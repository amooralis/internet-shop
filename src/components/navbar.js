import '../App.css';
import basket from "../images/basket.png"
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";

export default function Navbar() {

    const navigate = useNavigate();
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || {products: []});

    const updateCartFromLocalStorage = () => {
        const updatedCart = JSON.parse(localStorage.getItem('cart')) || {products: []};
        setCart(updatedCart);
    };

    const storedCart = localStorage.getItem('cart');

    useEffect(() => {
        updateCartFromLocalStorage();
    }, [storedCart]);

    const redirectToCart = () => {
        navigate('/cart');
    };

    const redirectToMain = () => {
        navigate('/');
    }


    return (
        <nav className="navbar">
            <button><h2 onClick={redirectToMain}>Shop.</h2></button>
            <button className="nav__cart__container">
                <div className="nav__cart__img__container">
                    <img onClick={redirectToCart} src={basket} alt="корзина"/>
                    <p className="nav__cart__bubble">{cart.products.reduce((acc, product) => acc + product.quantity, 0)}</p>
                </div>
                <p onClick={redirectToCart} className="nav__cart__cost">
                    <b>{cart.products.reduce((acc, product) => acc + product.cost * product.quantity, 0)} руб.</b>
                </p>
            </button>
        </nav>
    )
}

