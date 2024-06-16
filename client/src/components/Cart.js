import React from 'react';

const Cart = ({ cart, removeFromCart }) => {
    return (
        <div>
            <h2>Cart</h2>
            <ul>
                {cart.map(item => (
                    <li key={item._id}>
                        <p>{item.name} - R {item.price}</p>
                        <button onClick={() => removeFromCart(item._id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Cart;
