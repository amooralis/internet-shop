import './App.css';
import {useState} from "react";
import Navbar from "./navbar";
import {useCart} from "./cartContext";

export default function Cart() {

    const { cart, setCart, updateCartQuantity } = useCart();


    const deleteFromCart = (productId) => {
        let updatedCart = { ...cart };
        updatedCart.products = updatedCart.products.filter(p => p.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
        console.log(updatedCart);
    };


    return (
        <>
            <Navbar/>
            <div className="cart__page">
                <div className="cart__products">
                    {cart.products.length > 0 ? cart.products.map((product) => (
                        <div className="cart__position" key={product.id}>

                            <div className="cart__position__inner" key={product.id}>

                                {
                                    product.image ? (<img src={product?.image} alt="картинка"/>) :
                                        (<img src={product?.images[0].imagePath} alt="картинка"/>)
                                }

                                <div>
                                    <p className="cart__position__title"><b>{product.title}</b></p>

                                    <p className="cart__position__price"><b>{product.cost} руб.</b></p>
                                    <div className="cart__btns">
                                        <button onClick={() => updateCartQuantity(product.id, -1)}
                                                className="cart__btn">-
                                        </button>
                                        <p className="cart__btns__quantity">{product.quantity}</p>
                                        <button onClick={() => updateCartQuantity(product.id, 1)} className="cart__btn">+
                                        </button>
                                    </div>
                                </div>

                                <button onClick={() => deleteFromCart(product.id)} className="cart__btn btn--delete">
                                    X
                                </button>
                            </div>
                        </div>
                    )) : (
                        <p>Корзина пуста</p>
                    )}
                </div>
                <div className="cart__total">
                    <p>Кол-во товаров: <b>{cart.products.reduce((acc, product) => acc + product.quantity, 0)}</b></p>
                    <p>Сумма: <b>{cart.products.reduce((acc, product) => acc + product.cost * product.quantity, 0)} руб.</b>
                    </p>
                    {cart.products.length > 0 && (
                        <button className="btn--create--order">Создать заказ</button>
                    )}
                </div>
            </div>
        </>
    );
}