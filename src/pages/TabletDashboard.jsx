import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import apiFetch from '../utils/api';

const today = new Date().toISOString().split('T')[0];

const TabletDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [productionTasks, setProductionTasks] = useState([]);
  const [goals, setGoals] = useState({ daily: 0, monthly: 0, totalBoxesForGoal: 0, boxesRemaining: 0, requiredDailyAverage: 0 });
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [pin, setPin] = useState('');
  const [inventoryCounts, setInventoryCounts] = useState({});
  const [orderForm, setOrderForm] = useState({ storeId: '', productId: '', quantity: '', deliveryDate: today, notes: '' });
  const [deliveryDrivers, setDeliveryDrivers] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOperationalDashboard();
  }, []);

  const fetchOperationalDashboard = async () => {
    try {
      const data = await apiFetch('/api/operational/summary');
      const nextProducts = Array.isArray(data.products) ? data.products : [];
      setEmployees(Array.isArray(data.employees) ? data.employees : []);
      setStores(Array.isArray(data.stores) ? data.stores : []);
      setProducts(nextProducts);
      setReadyOrders(Array.isArray(data.readyOrders) ? data.readyOrders : []);
      setProductionTasks(Array.isArray(data.productionTasks) ? data.productionTasks : []);
      setGoals(data.goals || { daily: 0, monthly: 0, totalBoxesForGoal: 0, boxesRemaining: 0, requiredDailyAverage: 0 });
      setInventoryCounts(Object.fromEntries(nextProducts.map(product => [product.id, product.inventory])));
    } catch (error) {
      setMessage(error.message || 'Failed to load tablet dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockInOut = async () => {
    setMessage('');

    if (!selectedEmployee || !pin) {
      setMessage('Select an employee and enter their PIN.');
      return;
    }

    try {
      const data = await apiFetch('/api/operational/clock', {
        method: 'POST',
        body: JSON.stringify({ employeeId: selectedEmployee, pin }),
      });
      setMessage(`${data.employeeName} is now ${data.status}.`);
      setPin('');
    } catch (error) {
      setMessage(error.message || 'Clock in/out failed');
    }
  };

  const handleInventorySave = async (productId) => {
    try {
      const updatedProduct = await apiFetch(`/api/operational/inventory/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          inventory: Number(inventoryCounts[productId]),
          reason: 'tablet_inventory_count',
        }),
      });

      setMessage(`${updatedProduct.name} inventory saved at ${updatedProduct.inventory}.`);
      fetchOperationalDashboard();
    } catch (error) {
      setMessage(error.message || 'Inventory update failed');
    }
  };

  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    try {
      const order = await apiFetch('/api/operational/orders', {
        method: 'POST',
        body: JSON.stringify(orderForm),
      });

      setMessage(`Order created for ${order.store.name}: ${order.product.name} x ${order.quantity}.`);
      setOrderForm({ storeId: '', productId: '', quantity: '', deliveryDate: today, notes: '' });
      fetchOperationalDashboard();
    } catch (error) {
      setMessage(error.message || 'Order creation failed');
    }
  };

  const updateTaskStatus = async (task, orderStatus) => {
    try {
      await Promise.all(task.orderIds.map(orderId => apiFetch(`/api/operational/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ orderStatus }),
      })));

      setMessage(`${task.productName} marked ${orderStatus.replace('_', ' ')}.`);
      fetchOperationalDashboard();
    } catch (error) {
      setMessage(error.message || 'Failed to update baking task');
    }
  };

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
    doc.text(`Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString()}`, 46, 36);

    doc.text('Deliver To:', 14, 50);
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
    doc.text(`Driver: ${deliveryDrivers[order.id] || order.deliveredBy || ''}`, 14, finalY + 8);
    doc.line(14, finalY + 38, 92, finalY + 38);
    doc.text('Receiver Name / Signature', 14, finalY + 45);
    doc.line(118, finalY + 38, 196, finalY + 38);
    doc.text('Driver Signature', 118, finalY + 45);

    doc.save(`dehat-invoice-${invoiceNumber}.pdf`);
  };

  const markDelivered = async (order) => {
    const deliveredBy = deliveryDrivers[order.id];

    if (!deliveredBy) {
      setMessage('Select the delivery person before marking delivered.');
      return;
    }

    try {
      await apiFetch(`/api/operational/orders/${order.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ orderStatus: 'delivered', deliveredBy }),
      });

      setMessage(`${order.store.name} order marked delivered by ${deliveredBy}.`);
      fetchOperationalDashboard();
    } catch (error) {
      setMessage(error.message || 'Failed to mark delivered');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gold">Operational Tablet</h1>
          <p className="text-off-white">Daily counts, order intake, baking tasks, and delivery handoff.</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="btn-retheme md:w-auto"
        >
          Logout
        </button>
      </div>

      {message && <div className="card-retheme mb-6 text-gold">{message}</div>}

      {isLoading ? (
        <div className="card-retheme">Loading tablet dashboard...</div>
      ) : (
        <div className="space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card-retheme">
              <p className="text-sm">Monthly Goal</p>
              <p className="text-3xl font-bold text-gold">{goals.totalBoxesForGoal} / {goals.monthly}</p>
            </div>
            <div className="card-retheme">
              <p className="text-sm">Boxes Remaining</p>
              <p className="text-3xl font-bold text-gold">{goals.boxesRemaining}</p>
            </div>
            <div className="card-retheme">
              <p className="text-sm">Daily Target</p>
              <p className="text-3xl font-bold text-gold">{goals.requiredDailyAverage || goals.daily}</p>
            </div>
            <div className="card-retheme">
              <p className="text-sm">Ready for Driver</p>
              <p className="text-3xl font-bold text-gold">{readyOrders.length}</p>
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="card-retheme">
              <h2 className="text-2xl font-bold mb-4">Clock In/Out</h2>
              <div className="space-y-4">
                <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="input-retheme w-full">
                  <option value="" disabled>Select Employee</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>{employee.name} - {employee.role}</option>
                  ))}
                </select>
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="4-Digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength="4"
                  className="input-retheme w-full text-center text-2xl"
                />
                <button onClick={handleClockInOut} className="btn-retheme w-full text-xl py-4">Submit</button>
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="card-retheme xl:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Take Order</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={orderForm.storeId} onChange={(e) => setOrderForm({ ...orderForm, storeId: e.target.value })} className="input-retheme" required>
                  <option value="" disabled>Select Store</option>
                  {stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
                </select>
                <select value={orderForm.productId} onChange={(e) => setOrderForm({ ...orderForm, productId: e.target.value })} className="input-retheme" required>
                  <option value="" disabled>Select Product</option>
                  {products.map(product => <option key={product.id} value={product.id}>{product.name} - {product.boxSize}</option>)}
                </select>
                <input type="number" min="1" placeholder="Boxes" value={orderForm.quantity} onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })} className="input-retheme" required />
                <input type="date" value={orderForm.deliveryDate} onChange={(e) => setOrderForm({ ...orderForm, deliveryDate: e.target.value })} className="input-retheme" required />
                <input type="text" placeholder="Notes" value={orderForm.notes} onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })} className="input-retheme md:col-span-2" />
                <button type="submit" className="btn-retheme md:col-span-2 text-xl py-4">Create Order</button>
              </div>
            </form>
          </section>

          <section className="card-retheme">
            <h2 className="text-2xl font-bold mb-4">Baking Tasks from Orders</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {productionTasks.map(task => (
                <div key={task.productId} className="border border-gold/50 rounded p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-gold">{task.productName}</h3>
                      <p>{task.orderCount} orders | inventory {task.inventoryOnHand} | ordered {task.totalBoxesNeeded} boxes</p>
                      <p className="text-2xl font-bold">{task.boxesToBake} boxes / {task.piecesToBake} units to complete</p>
                      <p>Status: {task.status.replace('_', ' ')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updateTaskStatus(task, 'in_production')} className="btn-retheme">Start</button>
                      <button onClick={() => updateTaskStatus(task, 'ready')} className="btn-retheme">Ready</button>
                    </div>
                  </div>
                </div>
              ))}
              {productionTasks.length === 0 && <p className="text-off-white">No active baking tasks. New orders appear here automatically.</p>}
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="card-retheme">
              <h2 className="text-2xl font-bold mb-4">Inventory Count</h2>
              <div className="space-y-3 max-h-[620px] overflow-auto">
                {products.map(product => (
                  <div key={product.id} className="grid grid-cols-[1fr_110px_90px] gap-3 items-center border-b border-gold/40 pb-3">
                    <div>
                      <p className="font-bold">{product.name}</p>
                      <p className="text-sm text-off-white">{product.boxSize}</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={inventoryCounts[product.id] ?? 0}
                      onChange={(e) => setInventoryCounts({ ...inventoryCounts, [product.id]: e.target.value })}
                      className="input-retheme text-center"
                    />
                    <button onClick={() => handleInventorySave(product.id)} className="btn-retheme">Save</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-retheme">
              <h2 className="text-2xl font-bold mb-4">Ready for Delivery</h2>
              <div className="space-y-3">
                {readyOrders.map(order => (
                  <div key={order.id} className="border border-gold/50 rounded p-4">
                    <h3 className="text-xl font-bold text-gold">{order.store.name}</h3>
                    <p>{order.product.name} x {order.quantity}</p>
                    <p>Delivery: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                    <p>Payment: {order.paymentStatus}</p>
                    <div className="mt-4 space-y-3">
                      <select
                        value={deliveryDrivers[order.id] || ''}
                        onChange={(e) => setDeliveryDrivers({ ...deliveryDrivers, [order.id]: e.target.value })}
                        className="input-retheme w-full"
                      >
                        <option value="" disabled>Delivery person</option>
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.name}>{employee.name}</option>
                        ))}
                      </select>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <button onClick={() => generateInvoicePdf(order)} className="btn-retheme">Invoice</button>
                        <button onClick={() => markDelivered(order)} className="btn-retheme">Mark Delivered</button>
                      </div>
                    </div>
                  </div>
                ))}
                {readyOrders.length === 0 && <p className="text-off-white">No orders marked ready yet.</p>}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default TabletDashboard;
