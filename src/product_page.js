import {useEffect, useState} from "react";
import axios from "axios";
import {useLocation, useParams} from "react-router";
import Navbar from "./navbar";
import {useCart} from "./cartContext";
import Footer from "./footer";


export default function ProductPage() {
    const [product, setProduct] = useState(null);
    const {id} = useParams();
    const { addToCart } = useCart();


    useEffect(() => {
        const fetchProduct = async () => {

            try {
                const response = await axios.get(`https://webapi.omoloko.ru/api/v1/products/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setProduct(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProduct();
    }, [id]);

    return (
        <div>
            <Navbar/>
            <div className="full-card-page">
                <div className="full-card">
                    <img src={product?.images[0].imagePath} alt="картинка"/>
                    <div className="full-card-info">
                        <div>
                            <p className="full-card-title"><b>{product?.title}</b></p>
                            <p className="full-card-description">{product?.description}</p>
                        </div>
                        <div className="full-card-bottom">
                            <p className="full-card-price"><b>{product?.cost} руб.</b></p>
                            <button onClick={e => addToCart(e, product)} className="full-card-add-in-cart-btn">
                                В корзину
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}