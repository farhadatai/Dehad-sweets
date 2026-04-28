import React, { useState, useEffect } from 'react';

const UpdateInventoryModal = ({ product, isOpen, onClose, onSave }) => {
  const [inventory, setInventory] = useState(0);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (product) {
      setInventory(product.inventory || 0);
      setReason('');
    }
  }, [product]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(product.id, inventory, reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="card-retheme p-8 w-1/2">
        <h3 className="text-lg leading-6 font-medium text-gold mb-4">Update Inventory for {product.name}</h3>
        <div className="mt-2 px-7 py-3">
            <input
                type="number"
                placeholder="New Stock Quantity"
                min="0"
                value={inventory}
                onChange={(e) => setInventory(parseInt(e.target.value, 10) || 0)}
                className="input-retheme w-full mb-4"
            />
            <input
                type="text"
                placeholder="Reason for adjustment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input-retheme w-full"
            />
        </div>
        <div className="items-center px-4 py-3">
          <button onClick={handleSave} className="btn-retheme w-full mb-2">
            Save
          </button>
          <button onClick={onClose} className="bg-dark-brown text-gold p-2 rounded hover:bg-gold hover:text-black w-full">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInventoryModal;
