import React, { useEffect, useMemo, useState } from 'react';
import apiFetch from '../utils/api';

const StorePortal = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId),
    [products, productId]
  );

  const fetchPortal = async () => {
    const [productData, orderData] = await Promise.all([
      apiFetch('/api/customer/products'),
      apiFetch('/api/customer/orders'),
    ]);
    setProducts(Array.isArray(productData) ? productData : []);
    setOrders(Array.isArray(orderData) ? orderData : []);
    if (!productId && productData?.[0]) setProductId(productData[0].id);
  };

  useEffect(() => {
    fetchPortal().catch((error) => {
      console.error('Failed to load store portal:', error);
      setMessage(error.message || 'Could not load store portal');
    });
  }, []);

  const placeOrder = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await apiFetch('/api/customer/orders', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity: Number(quantity), deliveryDate, notes }),
      });
      setQuantity(1);
      setDeliveryDate('');
      setNotes('');
      setMessage('Order placed. Management and production can now see it.');
      fetchPortal();
    } catch (error) {
      setMessage(error.message || 'Could not place order');
    }
  };

  const unpaidTotal = orders
    .filter((order) => order.paymentStatus !== 'paid')
    .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-black text-off-white">
      <header className="border-b border-gold/40 bg-[#101010]">
        <div className="container mx-auto px-5 sm:px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gold">Store Portal</h1>
            <p className="text-off-white">Browse products, place orders, and track delivery status.</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/store-login';
            }}
            className="btn-retheme"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-5 sm:px-6 py-6 sm:py-8 grid grid-cols-1 xl:grid-cols-[0.85fr_1.15fr] gap-6">
        <section className="card-retheme">
          <h2 className="text-2xl font-bold mb-4">Place Order</h2>
          <form onSubmit={placeOrder} className="space-y-4">
            <select value={productId} onChange={(e) => setProductId(e.target.value)} className="input-retheme w-full" required>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
            {selectedProduct && (
              <div className="border border-gold/30 rounded p-4 bg-black">
                <p className="font-bold text-white">{selectedProduct.boxSize}</p>
                <p className="text-off-white">{selectedProduct.unitsPerCase} units per case</p>
                <p className="text-gold font-bold">${Number(selectedProduct.wholesalePricePerBox || 0).toFixed(2)} per box</p>
              </div>
            )}
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input-retheme w-full" required />
            <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="input-retheme w-full" required />
            <textarea placeholder="Notes for production or delivery" value={notes} onChange={(e) => setNotes(e.target.value)} className="input-retheme w-full min-h-28" />
            {message && <p className="text-gold">{message}</p>}
            <button type="submit" className="btn-retheme w-full py-3">Submit Order</button>
          </form>
        </section>

        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-retheme"><p className="text-sm">Orders</p><p className="text-3xl font-bold text-gold">{orders.length}</p></div>
            <div className="card-retheme"><p className="text-sm">Unpaid</p><p className="text-3xl font-bold text-gold">${unpaidTotal.toFixed(2)}</p></div>
            <div className="card-retheme"><p className="text-sm">Products</p><p className="text-3xl font-bold text-gold">{products.length}</p></div>
          </div>

          <div className="card-retheme overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Order History</h2>
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="table-header-retheme">
                  <th className="p-2 border table-grid-retheme">Product</th>
                  <th className="p-2 border table-grid-retheme">Qty</th>
                  <th className="p-2 border table-grid-retheme">Delivery</th>
                  <th className="p-2 border table-grid-retheme">Payment</th>
                  <th className="p-2 border table-grid-retheme">Status</th>
                  <th className="p-2 border table-grid-retheme">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="p-2 border table-grid-retheme">{order.product.name}</td>
                    <td className="p-2 border table-grid-retheme">{order.quantity}</td>
                    <td className="p-2 border table-grid-retheme">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                    <td className="p-2 border table-grid-retheme">{order.paymentStatus}</td>
                    <td className="p-2 border table-grid-retheme">{order.orderStatus}</td>
                    <td className="p-2 border table-grid-retheme">${Number(order.totalPrice || 0).toFixed(2)}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td className="p-3 border table-grid-retheme text-center" colSpan="6">No online orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StorePortal;
