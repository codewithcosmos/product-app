import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart } = useContext(CartContext);

    const handleRemove = (productId) => {
        removeFromCart(productId);
    };

    return (
        <div>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <div key={item.productId}>
                            <h3>{item.name}</h3>
                            <p>Price: ${item.price}</p>
                            <button onClick={() => handleRemove(item.productId)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <Link to="/checkout">
                        <button>Proceed to Checkout</button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default Cart;
