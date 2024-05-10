import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router";
import Navbar from "./navbar";


export default function ProductPage() {
    const [product, setProduct] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        const fetchProduct = async () => {

            try {
                const response = await axios.get(`http://localhost:3456/products/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });
                setProduct(response.data);
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
                    <img src={product?.image} alt="картинка"/>
                    <div className="full-card-info">
                        <div>
                            <p className="full-card-title"><b>{product?.title}</b></p>
                            <p>{product?.description}</p>
                        </div>
                        <div className="full-card-bottom">
                            <p className="full-card-price"><b>{product?.price}</b></p>
                            <button className="full-card-add-in-cart-btn">В корзину</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}