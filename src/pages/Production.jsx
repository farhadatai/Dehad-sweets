
import React, { useState, useEffect } from 'react';
import apiFetch from '../utils/api';

const Production = () => {
  const [productionData, setProductionData] = useState({ totalBoxesForGoal: 0, dailyBakingList: [], boxesRemaining: 0, requiredDailyAverage: 0, monthlyGoal: 5000 });
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    fetchProductionData();
  }, []);

  const fetchProductionData = async () => {
    try {
      const data = await apiFetch('/api/production');
      setProductionData(data);
      setNewGoal(data.monthlyGoal);
    } catch (error) {
      console.error('Failed to fetch production data:', error);
    }
  };

  const handleStatusUpdate = async (productId, orderStatus) => {
    try {
      const orders = await apiFetch('/api/orders');
      const ordersToUpdate = orders.filter(o => o.productId === productId && (o.orderStatus === 'pending' || o.orderStatus === 'in_production'));

      for (const order of ordersToUpdate) {
          await apiFetch(`/api/orders/${order.id}/status`, {
              method: 'PATCH',
              body: JSON.stringify({ orderStatus }),
          });
      }

      fetchProductionData();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleGoalUpdate = async (e) => {
    e.preventDefault();
    const now = new Date();
    try {
      await apiFetch('/api/production/goal', {
          method: 'POST',
          body: JSON.stringify({ month: now.getMonth() + 1, year: now.getFullYear(), goal: parseInt(newGoal) }),
      });
      fetchProductionData();
    } catch (error) {
      console.error('Failed to update production goal:', error);
    }
  };

  const progress = (productionData.totalBoxesForGoal / productionData.monthlyGoal) * 100;

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-4">Production</h1>
      
      {/* Goal Tracker */}
      <div className="card-retheme mb-8">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold mb-2">Monthly Goal: {productionData.monthlyGoal} Boxes</h2>
            <form onSubmit={handleGoalUpdate} className="flex items-center">
                <input type="number" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} className="input-retheme w-24" />
                <button type="submit" className="btn-retheme ml-2">Set Goal</button>
            </form>
        </div>
        <div className="w-full bg-dark-brown rounded-full h-8 mt-2">
          <div className="bg-gold h-8 rounded-full text-black text-center flex items-center justify-center" style={{ width: `${progress}%` }}>
            {progress.toFixed(2)}%
          </div>
        </div>
        <p className="text-right text-sm mt-1">{productionData.totalBoxesForGoal} / {productionData.monthlyGoal} boxes</p>
      </div>

      {/* Daily Baking List */}
      <div className="card-retheme mb-8">
        <h2 className="text-xl font-bold mb-4">Daily Baking Tasks</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="table-header-retheme">
              <th className="p-2 border table-grid-retheme">Product Name</th>
              <th className="p-2 border table-grid-retheme">Orders</th>
              <th className="p-2 border table-grid-retheme">Inventory</th>
              <th className="p-2 border table-grid-retheme">Boxes Ordered</th>
              <th className="p-2 border table-grid-retheme">Boxes to Bake</th>
              <th className="p-2 border table-grid-retheme">Units / Case</th>
              <th className="p-2 border table-grid-retheme">Units to Complete</th>
              <th className="p-2 border table-grid-retheme">Status</th>
              <th className="p-2 border table-grid-retheme">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productionData.dailyBakingList.map(item => (
              <tr key={item.productId} className="border-b table-grid-retheme">
                <td className="p-2 border table-grid-retheme">{item.productName}</td>
                <td className="p-2 border table-grid-retheme">{item.orderCount}</td>
                <td className="p-2 border table-grid-retheme">{item.inventoryOnHand}</td>
                <td className="p-2 border table-grid-retheme">{item.totalBoxesNeeded}</td>
                <td className="p-2 border table-grid-retheme font-bold text-gold">{item.boxesToBake}</td>
                <td className="p-2 border table-grid-retheme">{item.unitsPerCase}</td>
                <td className="p-2 border table-grid-retheme">{item.piecesToBake}</td>
                <td className="p-2 border table-grid-retheme">{item.status}</td>
                <td className="p-2 border table-grid-retheme">
                  <button onClick={() => handleStatusUpdate(item.productId, 'in_production')} className="btn-retheme mr-2">Start Batch</button>
                  <button onClick={() => handleStatusUpdate(item.productId, 'ready')} className="btn-retheme">Mark as Ready</button>
                </td>
              </tr>
            ))}
            {productionData.dailyBakingList.length === 0 && (
              <tr>
                <td className="p-4 border table-grid-retheme text-center" colSpan="9">No active baking tasks. New pending orders will appear here and on the store tablet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Production Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-retheme">
          <h2 className="text-lg font-semibold">Boxes Remaining for Goal</h2>
          <p className="text-3xl font-bold">{productionData.boxesRemaining}</p>
        </div>
        <div className="card-retheme">
          <h2 className="text-lg font-semibold">Required Daily Average</h2>
          <p className="text-3xl font-bold">{productionData.requiredDailyAverage}</p>
        </div>
      </div>
    </div>
  );
};

export default Production;
