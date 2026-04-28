
import React from 'react';

const Cart = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-serif font-bold mb-8 text-center">Shopping Cart</h1>
      {/* Cart items will be displayed here */}
      <div className="border rounded-lg p-4 shadow-lg">
        <p>Your cart is currently empty.</p>
      </div>
      <div className="text-right mt-8">
        <button className="bg-dark-brown text-white p-2 rounded hover:bg-opacity-80">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
