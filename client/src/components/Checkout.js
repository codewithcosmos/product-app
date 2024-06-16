import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useHistory } from 'react-router-dom';

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const history = useHistory();

    const handleCheckout = () => {
        // Logic for handling checkout (e.g., API call to place order)
        clearCart(); // Clear cart after checkout
        alert('Checkout completed successfully!');
        history.push('/'); // Redirect to home page after checkout
    };

    return (
        <div>
            <h2>Checkout</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <div key={item.productId}>
                            <h3>{item.name}</h3>
                            <p>Price: ${item.price}</p>
                        </div>
                    ))}
                    <button onClick={handleCheckout}>Complete Order</button>
                </>
            )}
        </div>
    );
};

export default Checkout;
