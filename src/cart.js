import './App.css';
import {useState} from "react";
import {useNavigate} from 'react-router-dom';
import Navbar from "./navbar";
import axios from "axios";

export default function Cart() {
    const navigate = useNavigate();
    const redirectToOrders = () => {
        navigate('/orders');
    };

    // Инициализация состояния корзины
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || { products: [] });

    const updateCartQuantity = (productId, change) => {
        let updatedCart = { ...cart };
        const productIndex = updatedCart.products.findIndex(p => p.id === productId);

        if (productIndex !== -1) {
            updatedCart.products[productIndex].quantity += change;

            // Если количество стало 0, удаляем товар из корзины
            if (updatedCart.products[productIndex].quantity <= 0) {
                updatedCart.products.splice(productIndex, 1);
            }

            // Обновляем состояние и сохраняем изменения в localStorage
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const deleteFromCart = (productId) => {
        let updatedCart = { ...cart };
        updatedCart.products = updatedCart.products.filter(p => p.id !== productId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };



    const createOrder = async () => {
        try {
            console.log("userId:",  localStorage.getItem('userId'));
            console.log("cart:",  localStorage.getItem('cart'));
            const newOrder = await axios.post("http://localhost:3456/my-orders",
                {userId: localStorage.getItem('userId'), cart: JSON.parse(localStorage.getItem('cart'))})
            console.log("Заказ:", newOrder.data);
            localStorage.removeItem('cart');
            setCart({ products: [] });
            redirectToOrders();
        } catch (error) {
            console.error("Error creating order", error);
        }
    };

    return (
        <>
            <Navbar/>
            <div className="cart-page">
                <div className="cart-products">
                    {cart.products.length > 0 ? cart.products.map((product) => (
                        <div className="cart-position" key={product.id}>
                            <p className="cart-position-title"><b>{product.title}</b></p>
                            <img src={product.image} alt="картинка" />
                            <p>{product.description}</p>
                            <p className="cart-position-price"><b>{product.price} руб.</b></p>
                            <div className="cart-btns">
                                <button onClick={() => updateCartQuantity(product.id, -1)} className="cart-btn">-</button>
                                <p className="cart-btns-quantity">{product.quantity}</p>
                                <button onClick={() => updateCartQuantity(product.id, 1)} className="cart-btn">+</button>
                            </div>
                            <button onClick={() => deleteFromCart(product.id)} className="cart-btn delete-btn">
                                Удалить
                            </button>
                        </div>
                    )) : (
                        <p>Корзина пуста</p>
                    )}
                </div>
                <div className="cart-total">
                    <p>Кол-во товаров: <b>{cart.products.reduce((acc, product) => acc + product.quantity, 0)}</b></p>
                    <p>Сумма: <b>{cart.products.reduce((acc, product) => acc + product.price * product.quantity, 0)} руб.</b></p>
                    {cart.products.length > 0 && (
                        <button className="create-order-btn" onClick={createOrder}>Создать заказ</button>
                    )}
                </div>
            </div>
        </>
    );
}
