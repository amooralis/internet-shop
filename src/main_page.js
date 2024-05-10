import './App.css';
import Navbar from "./navbar";
import {useEffect, useState} from "react";
import axios from "axios";
import search from "./search.png"
import sort from "./sort.png"
import {Link} from "react-router-dom";

export default function MainPage() {
    const [selectedSortOption, setSelectedSortOption] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    // const [cart, setCart] = useState([]); // New state for the shopping cart

    const handleSortChange = (value) => {
        setSelectedSortOption(value);
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const addToCart = async (event, product) => {
        event.preventDefault();
        try {
            const cart = await axios.get("http://localhost:3456/cart", {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
                params: {
                    userId: localStorage.getItem("userId"),
                },
            });

            if (!cart.data) {
                const cart = await axios.post("http://localhost:3456/cart", {
                    userId: localStorage.getItem("userId"),
                    products: product,
                });
                console.log(cart);
            } else {
                const userId = localStorage.getItem("userId");
                console.log("UserId:", userId);
                const cart = await axios.put("http://localhost:3456/cart", {
                    userId: localStorage.getItem("userId"),
                    products: product,
                });

                const updatedProducts = cart.data.products.reduce((accumulator, product) => {
                    const existingProduct = accumulator.find((p) => p.id === product.id);

                    if (existingProduct) {
                        existingProduct.quantity += 1;
                    } else {
                        accumulator.push({ ...product, quantity: 1 });
                    }

                    return accumulator;
                }, []);

                const updatedCart = {
                    ...cart.data,
                    products: updatedProducts,
                };

                console.log(updatedCart);
            }

        } catch (error) {
            console.error("Error adding product to cart", error);
        }
    }

    return (
        <>
            <Navbar/>
            <SearchLine handleSortChange={handleSortChange} handleSearchChange={handleSearchChange}/>
            <ProductsList selectedSortOption={selectedSortOption} searchQuery={searchQuery} addToCart={addToCart}/>
        </>
    )
}

function SearchLine({handleSortChange, handleSearchChange}) {
    return (
        <div className="main-first-line">
            <input
                className="search-input"
                placeholder="Search products..."
                onChange={(e) => handleSearchChange(e.target.value)}
            />
            <img type="search" src={search} alt="иконка"/>
            <select onChange={(e) => handleSortChange(Number(e.target.value))} className="filter-select">
                <option value={0}>по популярности</option>
                <option value={1}>по убыванию цены</option>
                <option value={2}>по возрастанию цены</option>
            </select>
            <img src={sort} alt="иконка"/>
        </div>
    )
}


function ProductsList({selectedSortOption, searchQuery, addToCart}) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:3456/products", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });
                const filteredProducts = response.data.filter((product) =>
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
            return products.slice().sort((a, b) => b.price - a.price);
        } else if (selectedSortOption === 2) {
            return products.slice().sort((a, b) => a.price - b.price);
        }
        return products;
    };


    return (
        <div className="product-page">
            {sortedProducts().map((product, i) => (
                <Link
                    to={`/products/${product.id}`}
                    key={product.id}
                    className="product-link"
                    style={{textDecoration: 'none'}}
                    product={product}
                >
                    <div className="product-card">
                        <div className="product-info">
                            <img src={product.image} alt="картинка"/>
                            <p className="product-info-title"><b>{product.title}</b></p>
                            <p>{product.description}</p>
                        </div>

                        <div className="product-card-bottom">
                            <p><b>{product.price}</b></p>
                            <button onClick={e => addToCart(e, product)} className="add-in-cart-btn">В корзину
                            </button>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}