import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const res = await axios.get('/api/cart');
      setCartItems(res.data);
    };
    fetchCartItems();
  }, []);

  const handleCheckout = async () => {
    try {
      const res = await axios.post('/api/cart/checkout');
      console.log('Checkout successful:', res.data);
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  if (!cartItems.length) return <div>Your cart is empty</div>;

  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {cartItems.map((item) => (
          <li key={item._id}>
            {item.name} - ${item.price} x {item.quantity}
          </li>
        ))}
      </ul>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default Cart;
