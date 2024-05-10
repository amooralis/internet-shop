import './App.css';
import axios from "axios";
import {useEffect, useState} from "react";
import Navbar from "./navbar";


export default function Orders() {

    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem("userId");
    const fetchOrders = async () => {
        try {
            const orders = await axios.get(`http://localhost:3456/my-orders/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
                params: {
                    userId: userId,
                },
            });

            if (!orders.data) {
                console.log("заказов нет");
            } else {
                setOrders(orders.data);
                console.log("ЗАКАЗ:", orders.data);
            }
        } catch (error) {
            console.error("Error while getting orders", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);


    return (
        <>
            <Navbar/>
            <div className="order-page">

                    {orders && orders.map((order) => (
                        <div className="order" key={order.id}>
                            <p className="order-id"><b>Заказ №{order.id}</b></p>
                                {order.cart.products.map((product) => (
                                   <img className="order-products-img" src={product.image} alt="картинка" key={product.id}/>
                                ))}
                            <p className="order-price"><b>{order.cart.products.reduce((acc, product) => acc + product.price, 0)} руб.</b></p>
                        </div>
                    ))}

            </div>
        </>
    )
}