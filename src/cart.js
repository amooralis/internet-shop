import './App.css';
import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import Navbar from "./navbar";


export default function Cart() {
    const navigate = useNavigate();
    const redirectToOrders = () => {
        navigate('/orders');
    }

    const [cart, setCart] = useState({products: []});
    const userId = localStorage.getItem("userId");
    const fetchCart = async () => {
        try {
            const cart = await axios.get("http://localhost:3456/cart", {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
                params: {
                    userId: userId,
                },
            });

            if (!cart.data) {
                console.log("пустая корзина");
            } else {
                const updatedProducts = cart.data.products.reduce((accumulator, product) => {
                    const existingProduct = accumulator.find((p) => p.id === product.id);

                    if (existingProduct) {
                        existingProduct.quantity += 1;
                    } else {
                        accumulator.push({...product, quantity: 1});
                    }

                    return accumulator;
                }, []);

                const updatedCart = {
                    ...cart.data,
                    products: updatedProducts,
                };
                setCart(updatedCart);
                console.log(updatedCart);
            }
        } catch (error) {
            console.error("Error adding product to cart", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (event, product) => {
        // event.preventDefault();
        try {
            const cart = await axios.get("http://localhost:3456/cart", {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
                params: {
                    userId: userId,
                },
            });

            if (!cart.data) {
                await axios.post("http://localhost:3456/cart", {
                    userId: userId,
                    products: product,
                });
                // console.log(cart);
            } else {
                await axios.put("http://localhost:3456/cart", {
                    userId: userId,
                    products: product,
                });

                await fetchCart()
            }

        } catch (error) {
            console.error("Error adding product to cart", error);
        }
    }

    const deleteFromCart = async (productId) => {
        try {
            // const userId = localStorage.getItem("userId");
            await axios.delete(`http://localhost:3456/cart/${productId}?userId=${userId}`)
                .then()
                .catch(error => {
                    console.error(error);
                });
            await fetchCart();
        } catch (error) {
            console.error("Error deleting product from cart", error);
        }
    }

    const createOrder = async (cart) => {
        try {
            const newOrder = await axios.post(`http://localhost:3456/my-orders`, {
                userId: userId,
                cartId: cart.id
            });

            await fetchCart();

            redirectToOrders();
            console.log("Заказ:", newOrder.data);
        } catch (error) {
            console.error("Error creating order", error);
        }
    }



    return (
        <>
            <Navbar/>
            <div className="cart-page">
                <div className="cart-products">
                    {cart.products.map((product,i) => (
                        <div className="cart-position" key={product[i]}>
                            <p className="cart-position-title"><b>{product.title}</b></p>
                            <img src={product.image} alt="картинка"/>
                            <p>{product.description}</p>
                            <p className="cart-position-price"><b>{product.price} руб.</b></p>
                            <div className="cart-btns">
                                <button onClick={(()=> deleteFromCart(product.id))} className="cart-btn">-
                                </button>
                                <p className="cart-btns-quantity">{product.quantity}</p>
                                <button onClick={((e) => addToCart(e, product))} className="cart-btn">+
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-total">
                    <p>Кол-во товаров: <b>{cart.products.reduce((acc, product) => acc + product.quantity, 0)}</b></p>
                    <p>Сумма: <b>{cart.products.reduce((acc, product) => acc + product.price * product.quantity, 0)}</b>
                    </p>
                    <button className="create-order-btn" onClick={(()=> createOrder(cart))}>Создать заказ</button>
                </div>
            </div>
        </>
    )
}