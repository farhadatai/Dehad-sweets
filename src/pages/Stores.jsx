
import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import apiFetch from '../utils/api';

const Stores = () => {
  const [stores, setStores] = useState(null);
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

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

  const handleEdit = (store) => {
    setIsEditing(true);
    setCurrentStore(store);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/api/stores/${currentStore.id}`, {
          method: 'PATCH',
          body: JSON.stringify(currentStore),
      });
      fetchStores();
      setIsEditing(false);
      setCurrentStore(null);
    } catch (error) {
      console.error('Failed to update store:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/api/stores', {
        method: 'POST',
        body: JSON.stringify({ name, owner, phone, address, email, notes }),
      });
      fetchStores();
      setName('');
      setOwner('');
      setPhone('');
      setAddress('');
      setEmail('');
      setNotes('');
    } catch (error) {
      console.error('Failed to create store:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/stores/${id}`, { method: 'DELETE' });
      fetchStores();
    } catch (error) {
      console.error('Failed to delete store:', error);
    }
  };

  const handleApproval = async (id, accountStatus) => {
    try {
      await apiFetch(`/api/stores/${id}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ accountStatus }),
      });
      fetchStores();
    } catch (error) {
      console.error('Failed to update store approval:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stores</h1>
      {isEditing ? (
        <div className="card-retheme mb-8">
            <h2 className="text-xl font-bold mb-4">Edit Store</h2>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Store Name" value={currentStore.name} onChange={(e) => setCurrentStore({...currentStore, name: e.target.value})} className="p-2 border border-gold rounded bg-card text-off-white" required />
                <input type="text" placeholder="Owner" value={currentStore.owner} onChange={(e) => setCurrentStore({...currentStore, owner: e.target.value})} className="p-2 border border-gold rounded bg-card text-off-white" required />
                <input type="text" placeholder="Phone" value={currentStore.phone} onChange={(e) => setCurrentStore({...currentStore, phone: e.target.value})} className="p-2 border border-gold rounded bg-card text-off-white" required />
                <input type="text" placeholder="Address" value={currentStore.address} onChange={(e) => setCurrentStore({...currentStore, address: e.target.value})} className="p-2 border border-gold rounded bg-card text-off-white" required />
                <input type="email" placeholder="Email" value={currentStore.email} onChange={(e) => setCurrentStore({...currentStore, email: e.target.value})} className="p-2 border border-gold rounded bg-card text-off-white" required />
                <input type="text" placeholder="Notes" value={currentStore.notes} onChange={(e) => setCurrentStore({...currentStore, notes: e.target.value})} className="p-2 border border-gold rounded bg-card text-off-white" />
                <button type="submit" className="btn-retheme col-span-1 md:col-span-2">Update Store</button>
                <button onClick={() => setIsEditing(false)} className="bg-dark-brown text-gold p-2 rounded hover:bg-gold hover:text-black col-span-1 md:col-span-2">Cancel</button>
            </form>
        </div>
      ) : (
        <div className="card-retheme mb-8">
            <h2 className="text-xl font-bold mb-4">Add New Store</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Store Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border border-gold rounded bg-card text-off-white" required />
            <input type="text" placeholder="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} className="p-2 border border-gold rounded bg-card text-off-white" required />
            <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="p-2 border border-gold rounded bg-card text-off-white" required />
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="p-2 border border-gold rounded bg-card text-off-white" required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 border border-gold rounded bg-card text-off-white" required />
            <input type="text" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="p-2 border border-gold rounded bg-card text-off-white" />
            <button type="submit" className="btn-retheme col-span-1 md:col-span-2">Add Store</button>
            </form>
        </div>
      )}
      <div className="card-retheme">
        <h2 className="text-xl font-bold mb-4">Existing Stores</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="table-header-retheme">
              <th className="p-2 border table-grid-retheme">Name</th>
              <th className="p-2 border table-grid-retheme">Owner</th>
              <th className="p-2 border table-grid-retheme">Phone</th>
              <th className="p-2 border table-grid-retheme">Address</th>
              <th className="p-2 border table-grid-retheme">Email</th>
              <th className="p-2 border table-grid-retheme">Account</th>
              <th className="p-2 border table-grid-retheme">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores && stores.map((store) => (
              <tr key={store.id} className="border-b table-grid-retheme">
                <td className="p-2 border table-grid-retheme">{store.name}</td>
                <td className="p-2 border table-grid-retheme">{store.owner}</td>
                <td className="p-2 border table-grid-retheme">{store.phone}</td>
                <td className="p-2 border table-grid-retheme">{store.address}</td>
                <td className="p-2 border table-grid-retheme">{store.email}</td>
                <td className="p-2 border table-grid-retheme">
                  <div className="space-y-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${store.isActive ? 'bg-green-900 text-green-100' : 'bg-yellow-900 text-yellow-100'}`}>
                      {store.users?.[0]?.accountStatus || (store.isActive ? 'APPROVED' : 'PENDING')}
                    </span>
                    {store.users?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleApproval(store.id, 'APPROVED')} className="btn-retheme text-xs px-2 py-1">Approve</button>
                        <button onClick={() => handleApproval(store.id, 'REJECTED')} className="btn-retheme text-xs px-2 py-1">Reject</button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-2 border table-grid-retheme">
                    <button onClick={() => handleEdit(store)} className="text-gold hover:text-off-white"><FaPencilAlt /></button>
                    <button onClick={() => handleDelete(store.id)} className="text-red-500 hover:text-red-700 ml-2"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stores;
