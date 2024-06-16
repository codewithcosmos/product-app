// Import necessary dependencies from React
import React, { createContext, useState } from 'react';

// Create a new context object
export const CartContext = createContext();

// Create a provider component for the CartContext
export const CartProvider = ({ children }) => {
    // State to hold the cart items
    const [cart, setCart] = useState([]);

    // Function to add an item to the cart
    const addToCart = (product) => {
        setCart([...cart, product]);
    };

    // Function to remove an item from the cart
    const removeFromCart = (productId) => {
        const updatedCart = cart.filter((item) => item.productId !== productId);
        setCart(updatedCart);
    };

    // Function to clear the entire cart
    const clearCart = () => {
        setCart([]);
    };

    // Value object to be passed to the provider
    const value = {
        cart,
        addToCart,
        removeFromCart,
        clearCart
    };

    // Render the provider with the provided children and the value object
    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
