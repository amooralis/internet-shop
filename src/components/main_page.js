import '../App.css';
import Navbar from "./navbar";
import {useEffect, useState} from "react";
import axios from "axios";
import search from "../images/search.png"
import sort from "../images/sort.png"
import {Link} from "react-router-dom";
import Footer from "./footer";
import {useCart} from "../cartContext";

export default function MainPage() {
    const [selectedSortOption, setSelectedSortOption] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const {cart, setCart, addToCart, updateCartQuantity} = useCart();
    const handleSortChange = (value) => {
        setSelectedSortOption(value);
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };


    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        if (storedCart) {
            setCart(storedCart);
        }
    }, [setCart]);


    return (
        <div className="page">
            <Navbar/>
            <SearchLine handleSortChange={handleSortChange} handleSearchChange={handleSearchChange}/>
            <ProductsList
                selectedSortOption={selectedSortOption}
                searchQuery={searchQuery}
                cart={cart}
                addToCart={addToCart}
                updateCartQuantity={updateCartQuantity}
            />
            <Footer/>

        </div>
    )
}

function SearchLine({handleSortChange, handleSearchChange}) {
    return (
        <header className="main-first-line">
            <div className="search-part">
                <input
                    className="search-input"
                    placeholder="Search products..."
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
                <img type="search" src={search} alt="иконка"/>
            </div>
            <div className="search-part">
                <select onChange={(e) => handleSortChange(Number(e.target.value))} className="filter-select">
                    <option value={0}>по популярности</option>
                    <option value={1}>по убыванию цены</option>
                    <option value={2}>по возрастанию цены</option>
                    <option value={3}>по названию</option>
                </select>
                <img src={sort} alt="иконка"/>
            </div>
        </header>
    )
}


function ProductsList({selectedSortOption, searchQuery, addToCart, updateCartQuantity}) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("https://webapi.omoloko.ru/api/v1/products", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    params: {
                        limit: 10,
                    },
                });
                const filteredProducts = response.data.products.filter((product) =>
                    product.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setProducts(filteredProducts);
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProducts();
    }, [searchQuery]);

    const sortedProducts = () => {
        if (selectedSortOption === 1) {
            return products.slice().sort((a, b) => b.cost - a.cost);
        } else if (selectedSortOption === 2) {
            return products.slice().sort((a, b) => a.cost - b.cost);
        } else if (selectedSortOption === 3) {
            return products.slice().sort((a, b) => a.title.localeCompare(b.title));
        }
        return products;
    };


    return (
        <section className="mainpage">
            {sortedProducts().map((product, i) => {
                // Получаем корзину и проверяем наличие продукта в ней
                const cart = JSON.parse(localStorage.getItem('cart')) || {products: []};
                const cartProduct = cart.products.find(p => p.id === product.id);
                const quantity = cartProduct ? cartProduct.quantity : 0;

                return (
                    <article key={product.id} className="mainpage__product">
                        <Link
                            to={{
                                pathname: `internet-shop/products/${product.id}`,
                                state: {addToCart}
                            }}
                            className="mainpage__product__link"
                            style={{textDecoration: 'none'}}
                        >
                            <div className="mainpage__product__info">
                                <img src={product.image} alt="изображение товара"/>
                                <p className="mainpage__product__info__title"><b>{product.title}</b></p>
                            </div>
                        </Link>

                        <div className="mainpage__product__bottom">
                            <p className="mainpage__product__price"><b>{product.cost} руб.</b></p>
                            {quantity > 0 ? (
                                <div className="mainpage__product__bottom__quantity__controls">
                                    <button className="btn--little"
                                            onClick={() => updateCartQuantity(product.id, -1)}>-
                                    </button>
                                    <span className="mainpage__product__bottom__quantity">{quantity}</span>
                                    <button className="btn--little" onClick={() => updateCartQuantity(product.id, 1)}>+
                                    </button>
                                </div>
                            ) : (
                                <button onClick={e => addToCart(e, product)} className="btn--add--in--cart">
                                    В корзину
                                </button>
                            )}
                        </div>
                    </article>
                );
            })}
        </section>
    );

}