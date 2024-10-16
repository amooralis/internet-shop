import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || { products: [] });

    const addToCart = (event, product) => {
        event.preventDefault();

        let updatedCart = { ...cart };
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
        let updatedCart = { ...cart };
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

    return (
        <CartContext.Provider value={{ cart, addToCart, updateCartQuantity }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
