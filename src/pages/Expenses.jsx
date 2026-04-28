
import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import apiFetch from '../utils/api';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [item, setItem] = useState('');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await apiFetch('/api/expenses');
      if (Array.isArray(data)) {
        setExpenses(data);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      setExpenses([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('item', item);
    formData.append('category', category);
    formData.append('amount', amount);
    formData.append('date', date);
    if (receipt) {
        formData.append('receipt', receipt);
    }

    try {
      await apiFetch('/api/expenses', {
        method: 'POST',
        body: formData,
      });
      fetchExpenses();
      setItem('');
      setCategory('Food');
      setAmount('');
      setDate('');
      setReceipt(null);
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  const handleEdit = (expense) => {
    setIsEditing(true);
    setCurrentExpense(expense);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('item', currentExpense.item);
    formData.append('category', currentExpense.category);
    formData.append('amount', currentExpense.amount);
    formData.append('date', currentExpense.date);
    if (currentExpense.receipt) {
        formData.append('receipt', currentExpense.receipt);
    }

    try {
      await apiFetch(`/api/expenses/${currentExpense.id}`, {
        method: 'PATCH',
        body: formData,
      });
      fetchExpenses();
      setIsEditing(false);
      setCurrentExpense(null);
    } catch (error) {
      console.error('Failed to update expense:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/expenses/${id}`, { method: 'DELETE' });
      fetchExpenses();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };


  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      
      {isEditing ? (
        <div className="card-retheme mb-8">
          <h2 className="text-xl font-bold mb-4">Edit Expense</h2>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item"
              value={currentExpense.item}
              onChange={(e) => setCurrentExpense({ ...currentExpense, item: e.target.value })}
              className="input-retheme"
              required
            />
            <select value={currentExpense.category} onChange={(e) => setCurrentExpense({ ...currentExpense, category: e.target.value })} className="input-retheme" required>
              <option>Food</option>
              <option>Utilities</option>
              <option>Rent</option>
              <option>Supplies</option>
              <option>Other</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={currentExpense.amount}
              onChange={(e) => setCurrentExpense({ ...currentExpense, amount: e.target.value })}
              className="input-retheme"
              required
            />
            <input
              type="date"
              value={new Date(currentExpense.date).toISOString().split('T')[0]}
              onChange={(e) => setCurrentExpense({ ...currentExpense, date: e.target.value })}
              className="input-retheme"
              required
            />
            <input
              type="file"
              onChange={(e) => setCurrentExpense({ ...currentExpense, receipt: e.target.files[0] })}
              className="input-retheme col-span-1 md:col-span-2"
            />
            <button type="submit" className="btn-retheme col-span-1 md:col-span-2">Update Expense</button>
            <button onClick={() => setIsEditing(false)} className="bg-dark-brown text-gold p-2 rounded hover:bg-gold hover:text-black col-span-1 md:col-span-2">Cancel</button>
          </form>
        </div>
      ) : (
        <div className="card-retheme mb-8">
          <h2 className="text-xl font-bold mb-4">Add Expense</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="input-retheme"
              required
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-retheme" required>
              <option>Food</option>
              <option>Utilities</option>
              <option>Rent</option>
              <option>Supplies</option>
              <option>Other</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-retheme"
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-retheme"
              required
            />
            <input
              type="file"
              onChange={(e) => setReceipt(e.target.files[0])}
              className="input-retheme col-span-1 md:col-span-2"
            />
            <button type="submit" className="btn-retheme col-span-1 md:col-span-2">Add Expense</button>
          </form>
        </div>
      )}

      <div className="card-retheme">
        <h2 className="text-xl font-bold mb-4">Logged Expenses</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="table-header-retheme">
              <th className="p-2 border table-grid-retheme">Item</th>
              <th className="p-2 border table-grid-retheme">Category</th>
              <th className="p-2 border table-grid-retheme">Amount</th>
              <th className="p-2 border table-grid-retheme">Date</th>
              <th className="p-2 border table-grid-retheme">Receipt</th>
              <th className="p-2 border table-grid-retheme">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses && expenses.map((expense) => (
              <tr key={expense.id} className="border-b table-grid-retheme">
                <td className="p-2 border table-grid-retheme">{expense.item}</td>
                <td className="p-2 border table-grid-retheme">{expense.category}</td>
                <td className="p-2 border table-grid-retheme">${expense.amount.toFixed(2)}</td>
                <td className="p-2 border table-grid-retheme">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="p-2 border table-grid-retheme">
                    {expense.receipt && <a href={`/${expense.receipt}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-off-white">View</a>}
                </td>
                <td className="p-2 border table-grid-retheme">
                    <button onClick={() => handleEdit(expense)} className="text-gold hover:text-off-white"><FaPencilAlt /></button>
                    <button onClick={() => handleDelete(expense.id)} className="text-red-500 hover:text-red-700 ml-2"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
