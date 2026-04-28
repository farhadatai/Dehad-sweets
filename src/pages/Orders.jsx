
import React, { useState, useEffect } from 'react';
import { FaFileInvoice, FaPencilAlt, FaTrash, FaUpload } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import apiFetch from '../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [storeId, setStoreId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [signedInvoiceFile, setSignedInvoiceFile] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchStores();
    fetchProducts();
    fetchEmployees();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await apiFetch('/api/orders');
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    }
  };

  const fetchStores = async () => {
    try {
      const data = await apiFetch('/api/stores');
      if (Array.isArray(data)) {
        setStores(data);
      } else {
        setStores([]);
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      setStores([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await apiFetch('/api/products');
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await apiFetch('/api/admin/employees');
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      setEmployees([]);
    }
  };

  const handleEdit = (order) => {
    setIsEditing(true);
    setSignedInvoiceFile(null);
    setCurrentOrder({
        ...order,
        notes: order.notes ?? '',
        deliveredBy: order.deliveredBy ?? '',
        receiverName: order.receiverName ?? '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/api/orders/${currentOrder.id}`, {
          method: 'PATCH',
          body: JSON.stringify(currentOrder),
      });

      if (signedInvoiceFile) {
        const formData = new FormData();
        formData.append('deliveryInvoice', signedInvoiceFile);
        formData.append('deliveredBy', currentOrder.deliveredBy || '');
        formData.append('receiverName', currentOrder.receiverName || '');

        await apiFetch(`/api/orders/${currentOrder.id}/delivery`, {
          method: 'PATCH',
          body: formData,
        });
      }

      fetchOrders();
      setIsEditing(false);
      setCurrentOrder(null);
      setSignedInvoiceFile(null);
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === productId);
    const pricePerBox = product ? product.wholesalePricePerBox : 0;
    try {
      await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({ storeId, productId, quantity: parseInt(quantity), pricePerBox, deliveryDate, notes }),
      });
      fetchOrders();
      setStoreId('');
      setProductId('');
      setQuantity('');
      setDeliveryDate('');
      setNotes('');
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/orders/${id}`, { method: 'DELETE' });
      fetchOrders();
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (paymentFilter === 'all') return true;
    if (paymentFilter === 'unpaid') return order.paymentStatus !== 'paid';
    return order.paymentStatus === paymentFilter;
  });

  const totalOwed = orders
    .filter(order => order.paymentStatus !== 'paid')
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const totalPaid = orders
    .filter(order => order.paymentStatus === 'paid')
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const loadImageAsDataUrl = async (src) => {
    const response = await fetch(src);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generateInvoicePdf = async (order) => {
    const doc = new jsPDF();
    const invoiceNumber = order.id.slice(-8).toUpperCase();
    const deliveryDate = new Date(order.deliveryDate).toLocaleDateString();

    try {
      const logo = await loadImageAsDataUrl('/dehat-logo.png');
      doc.addImage(logo, 'PNG', 14, 10, 26, 26);
    } catch (error) {
      console.error('Failed to load invoice logo:', error);
    }

    doc.setFontSize(18);
    doc.text('Dehat Sweets and Foods', 46, 18);
    doc.setFontSize(12);
    doc.text(`Delivery Invoice #${invoiceNumber}`, 46, 28);
    doc.text(`Delivery Date: ${deliveryDate}`, 46, 36);

    doc.text('Bill To / Deliver To:', 14, 50);
    doc.text(order.store.name, 14, 58);
    doc.text(order.store.owner || '', 14, 66);
    doc.text(order.store.address || '', 14, 74);
    doc.text(order.store.phone || '', 14, 82);

    autoTable(doc, {
      startY: 96,
      head: [['Product', 'Box Size', 'Qty', 'Price / Box', 'Total']],
      body: [[
        order.product.name,
        order.product.boxSize,
        order.quantity,
        `$${Number(order.pricePerBox || 0).toFixed(2)}`,
        `$${Number(order.totalPrice || 0).toFixed(2)}`,
      ]],
    });

    const finalY = doc.lastAutoTable.finalY + 12;
    doc.text(`Payment Status: ${order.paymentStatus}`, 14, finalY);
    doc.text(`Order Status: ${order.orderStatus}`, 14, finalY + 8);
    if (order.notes) doc.text(`Notes: ${order.notes}`, 14, finalY + 16);

    doc.line(14, finalY + 38, 92, finalY + 38);
    doc.text('Receiver Name / Signature', 14, finalY + 45);
    doc.line(118, finalY + 38, 196, finalY + 38);
    doc.text('Driver Signature', 118, finalY + 45);

    doc.save(`dehat-invoice-${invoiceNumber}.pdf`);
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {isEditing ? (
        <div className="card-retheme mb-8">
            <h2 className="text-xl font-bold mb-4">Edit Order</h2>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={currentOrder.storeId} onChange={(e) => setCurrentOrder({...currentOrder, storeId: e.target.value})} className="input-retheme" required>
                    <option value="" disabled>Select Store</option>
                    {stores.map(store => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                </select>
                <select value={currentOrder.productId} onChange={(e) => setCurrentOrder({...currentOrder, productId: e.target.value})} className="input-retheme" required>
                    <option value="" disabled>Select Product</option>
                    {products.map(product => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                </select>
                <input type="number" placeholder="Quantity" value={currentOrder.quantity} onChange={(e) => setCurrentOrder({...currentOrder, quantity: parseInt(e.target.value)})} className="input-retheme" required />
                <input type="date" placeholder="Delivery Date" value={new Date(currentOrder.deliveryDate).toISOString().split('T')[0]} onChange={(e) => setCurrentOrder({...currentOrder, deliveryDate: e.target.value})} className="input-retheme" required />
                <input type="text" placeholder="Notes" value={currentOrder.notes} onChange={(e) => setCurrentOrder({...currentOrder, notes: e.target.value})} className="input-retheme" />
                <select value={currentOrder.paymentStatus} onChange={(e) => setCurrentOrder({...currentOrder, paymentStatus: e.target.value})} className="input-retheme" required>
                    <option>unpaid</option>
                    <option>partial</option>
                    <option>paid</option>
                </select>
                <select value={currentOrder.orderStatus} onChange={(e) => setCurrentOrder({...currentOrder, orderStatus: e.target.value})} className="input-retheme" required>
                    <option>pending</option>
                    <option>in_production</option>
                    <option>ready</option>
                    <option>delivered</option>
                    <option>cancelled</option>
                </select>
                <select value={currentOrder.deliveredBy} onChange={(e) => setCurrentOrder({...currentOrder, deliveredBy: e.target.value})} className="input-retheme">
                    <option value="" disabled>Delivered By</option>
                    {employees.map(employee => (
                        <option key={employee.id} value={employee.name}>{employee.name}</option>
                    ))}
                </select>
                <input type="text" placeholder="Receiver Name" value={currentOrder.receiverName} onChange={(e) => setCurrentOrder({...currentOrder, receiverName: e.target.value})} className="input-retheme" />
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setSignedInvoiceFile(e.target.files?.[0] || null)}
                  className="input-retheme col-span-1 md:col-span-2"
                />
                {currentOrder.deliveryInvoice && (
                  <a
                    href={currentOrder.deliveryInvoice}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold underline col-span-1 md:col-span-2"
                  >
                    View uploaded signed invoice
                  </a>
                )}
                <button type="submit" className="btn-retheme col-span-1 md:col-span-2">Update Order</button>
                <button onClick={() => setIsEditing(false)} className="bg-dark-brown text-gold p-2 rounded hover:bg-gold hover:text-black col-span-1 md:col-span-2">Cancel</button>
            </form>
        </div>
        ) : (
        <div className="card-retheme mb-8">
            <h2 className="text-xl font-bold mb-4">Create New Order</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={storeId} onChange={(e) => setStoreId(e.target.value)} className="input-retheme" required>
                <option value="" disabled>Select Store</option>
                {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
                ))}
            </select>
            <select value={productId} onChange={(e) => setProductId(e.target.value)} className="input-retheme" required>
                <option value="" disabled>Select Product</option>
                {products.map(product => (
                <option key={product.id} value={product.id}>{product.name}</option>
                ))}
            </select>
            <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input-retheme" required />
            <input type="date" placeholder="Delivery Date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="input-retheme" required />
            <input type="text" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="input-retheme" />
            <button type="submit" className="btn-retheme col-span-1 md:col-span-2">Create Order</button>
            </form>
        </div>
        )}
      <div className="card-retheme">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold">Existing Orders</h2>
            <p className="text-sm text-off-white">Paid: ${totalPaid.toFixed(2)} | Owed: ${totalOwed.toFixed(2)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'unpaid', 'partial', 'paid'].map(status => (
              <button
                key={status}
                onClick={() => setPaymentFilter(status)}
                className={paymentFilter === status ? 'btn-retheme' : 'bg-dark-brown text-gold p-2 rounded hover:bg-gold hover:text-black'}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="table-header-retheme">
              <th className="p-2 border table-grid-retheme">Store</th>
              <th className="p-2 border table-grid-retheme">Product</th>
              <th className="p-2 border table-grid-retheme">Quantity</th>
              <th className="p-2 border table-grid-retheme">Total Price</th>
              <th className="p-2 border table-grid-retheme">Placement Date</th>
              <th className="p-2 border table-grid-retheme">Delivery Date</th>
              <th className="p-2 border table-grid-retheme">Payment</th>
              <th className="p-2 border table-grid-retheme">Status</th>
              <th className="p-2 border table-grid-retheme">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b table-grid-retheme">
                <td className="p-2 border table-grid-retheme">{order.store.name}</td>
                <td className="p-2 border table-grid-retheme">{order.product.name}</td>
                <td className="p-2 border table-grid-retheme">{order.quantity}</td>
                <td className="p-2 border table-grid-retheme">${order.totalPrice.toFixed(2)}</td>
                <td className="p-2 border table-grid-retheme">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-2 border table-grid-retheme">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                <td className="p-2 border table-grid-retheme">{order.paymentStatus}</td>
                <td className="p-2 border table-grid-retheme">{order.orderStatus}</td>
                <td className="p-2 border table-grid-retheme">
                    <button
                      onClick={() => generateInvoicePdf(order)}
                      disabled={!['ready', 'delivered'].includes(order.orderStatus)}
                      title={['ready', 'delivered'].includes(order.orderStatus) ? 'Print delivery invoice' : 'Invoice is available when order is ready'}
                      className="text-gold hover:text-off-white disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FaFileInvoice />
                    </button>
                    <button onClick={() => handleEdit(order)} title="Edit order or upload signed invoice" className="text-gold hover:text-off-white ml-2"><FaPencilAlt /></button>
                    {order.deliveryInvoice && (
                      <a href={order.deliveryInvoice} target="_blank" rel="noreferrer" title="View signed invoice" className="inline-block text-gold hover:text-off-white ml-2">
                        <FaUpload />
                      </a>
                    )}
                    <button onClick={() => handleDelete(order.id)} className="text-red-500 hover:text-red-700 ml-2"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
