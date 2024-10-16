import './App.css';
import Navbar from "./navbar";
import {useEffect, useState} from "react";
import axios from "axios";
import search from "./search.png"
import sort from "./sort.png"
import {Link} from "react-router-dom";
import Footer from "./footer";

export default function MainPage() {
    const [selectedSortOption, setSelectedSortOption] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || {products: []});

    const handleSortChange = (value) => {
        setSelectedSortOption(value);
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };


    const addToCart = (event, product) => {
        event.preventDefault();

        let updatedCart = {...cart};
        const existingProduct = updatedCart.products.find(p => p.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            product.quantity = 1;
            updatedCart.products.push(product);
        }

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const updateCartQuantity = (productId, change) => {
        let updatedCart = {...cart};
        const productIndex = updatedCart.products.findIndex(p => p.id === productId);

        if (productIndex !== -1) {
            updatedCart.products[productIndex].quantity += change;

            if (updatedCart.products[productIndex].quantity <= 0) {
                updatedCart.products.splice(productIndex, 1);
            }

            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    // Обновление состояния корзины при изменении localStorage
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        if (storedCart) {
            setCart(storedCart);
        }
    }, []);


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
                console.log(response);
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
        <section className="product-page">
            {sortedProducts().map((product, i) => {
                // Получаем корзину и проверяем наличие продукта в ней
                const cart = JSON.parse(localStorage.getItem('cart')) || {products: []};
                const cartProduct = cart.products.find(p => p.id === product.id);
                const quantity = cartProduct ? cartProduct.quantity : 0;

                return (
                    <article key={product.id} className="product-card">
                        <Link
                            to={{
                                pathname: `/products/${product.id}`,
                                state: { addToCart }
                            }}
                            className="product-link"
                            style={{textDecoration: 'none'}}
                        >
                            <div className="product-info">
                                <img src={product.image} alt="картинка"/>
                                <p className="product-info-title"><b>{product.title}</b></p>
                                <p>{product.description}</p>
                            </div>
                        </Link>

                        <div className="product-card-bottom">
                            <p className="product-price"><b>{product.cost} руб.</b></p>
                            {quantity > 0 ? (
                                <div className="quantity-controls">
                                    <button className="little-btn"
                                            onClick={() => updateCartQuantity(product.id, -1)}>-
                                    </button>
                                    <span className="product-quantity">{quantity}</span>
                                    <button className="little-btn" onClick={() => updateCartQuantity(product.id, 1)}>+
                                    </button>
                                </div>
                            ) : (
                                <button onClick={e => addToCart(e, product)} className="add-in-cart-btn">
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