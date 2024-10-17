import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router";
import Navbar from "./navbar";
import {useCart} from "./cartContext";
import Footer from "./footer";


export default function ProductPage() {
    const [product, setProduct] = useState(null);
    const {id} = useParams();
    const { addToCart} = useCart();


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
            <div className="product__page">
                <div className="product">
                    <img src={product?.images[0].imagePath} alt="изображение товара"/>
                    <div className="product__info">
                        <div>
                            <p className="product__title"><b>{product?.title}</b></p>
                            <p className="product__description">{product?.description}</p>
                        </div>
                        <div className="product__bottom">
                            <p className="product__price"><b>{product?.cost} руб.</b></p>
                            <button onClick={e => addToCart(e, product)} className="product__btn--add--in--cart">
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