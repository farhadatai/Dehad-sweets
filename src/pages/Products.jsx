
import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrash, FaBoxOpen } from 'react-icons/fa';
import apiFetch from '../utils/api';
import UpdateInventoryModal from '../components/UpdateInventoryModal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Sweet');
  const [boxSize, setBoxSize] = useState('');
  const [unitsPerCase, setUnitsPerCase] = useState('');
  const [costPerBox, setCostPerBox] = useState('');
  const [wholesalePricePerBox, setWholesalePricePerBox] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleOpenUpdateInventoryModal = (product) => {
    setCurrentProduct(product);
    setIsInventoryModalOpen(true);
  };

  const handleUpdateInventory = async (productId, inventory, reason) => {
    try {
      await apiFetch(`/api/inventory/${productId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ inventory, reason }),
        });
      fetchProducts();
      setIsInventoryModalOpen(false);
    } catch (error) {
      console.error('Failed to update inventory:', error);
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/api/products/${currentProduct.id}`, {
          method: 'PATCH',
          body: JSON.stringify(currentProduct),
      });
      fetchProducts();
      setIsEditing(false);
      setCurrentProduct(null);
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify({ name, category, boxSize, unitsPerCase: parseInt(unitsPerCase), costPerBox: parseFloat(costPerBox), wholesalePricePerBox: parseFloat(wholesalePricePerBox) }),
      });
      fetchProducts();
      setName('');
      setCategory('Sweet');
      setBoxSize('');
      setUnitsPerCase('');
      setCostPerBox('');
      setWholesalePricePerBox('');
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const calculateProfitMargin = (cost, price) => {
    if (price === 0) return 'N/A';
    const margin = ((price - cost) / price) * 100;
    return `${margin.toFixed(2)}%`;
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
        {isEditing ? (
            <div className="card-retheme mb-8">
                <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Product Name" value={currentProduct.name} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} className="input-retheme" required />
                    <select value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})} className="input-retheme" required>
                        <option>Sweet</option>
                        <option>Savory</option>
                        <option>Bread</option>
                    </select>
                    <input type="text" placeholder="Box Size" value={currentProduct.boxSize} onChange={(e) => setCurrentProduct({...currentProduct, boxSize: e.target.value})} className="input-retheme" required />
                    <input type="number" placeholder="Units per Case" value={currentProduct.unitsPerCase} onChange={(e) => setCurrentProduct({...currentProduct, unitsPerCase: parseInt(e.target.value)})} className="input-retheme" required />
                    <input type="number" step="0.01" placeholder="Cost Per Box" value={currentProduct.costPerBox} onChange={(e) => setCurrentProduct({...currentProduct, costPerBox: parseFloat(e.target.value)})} className="input-retheme" required />
                    <input type="number" step="0.01" placeholder="Wholesale Price Per Box" value={currentProduct.wholesalePricePerBox} onChange={(e) => setCurrentProduct({...currentProduct, wholesalePricePerBox: parseFloat(e.target.value)})} className="input-retheme" required />
                    <button type="submit" className="btn-retheme col-span-1 md:col-span-2">Update Product</button>
                    <button onClick={() => setIsEditing(false)} className="bg-dark-brown text-gold p-2 rounded hover:bg-gold hover:text-black col-span-1 md:col-span-2">Cancel</button>
                </form>
            </div>
        ) : (
            <div className="card-retheme mb-8">
                <h2 className="text-xl font-bold mb-4">Add New Product</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className="input-retheme" required />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-retheme" required>
                    <option>Sweet</option>
                    <option>Savory</option>
                    <option>Bread</option>
                </select>
                <input type="text" placeholder="Box Size" value={boxSize} onChange={(e) => setBoxSize(e.target.value)} className="input-retheme" required />
                <input type="number" placeholder="Units per Case" value={unitsPerCase} onChange={(e) => setUnitsPerCase(e.target.value)} className="input-retheme" required />
                <input type="number" step="0.01" placeholder="Cost Per Box" value={costPerBox} onChange={(e) => setCostPerBox(e.target.value)} className="input-retheme" required />
                <input type="number" step="0.01" placeholder="Wholesale Price Per Box" value={wholesalePricePerBox} onChange={(e) => setWholesalePricePerBox(e.target.value)} className="input-retheme" required />
                <button type="submit" className="btn-retheme col-span-1 md:col-span-2">Add Product</button>
                </form>
            </div>
        )}
      <div className="card-retheme">
        <h2 className="text-xl font-bold mb-4">Existing Products</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="table-header-retheme">
              <th className="p-2 border table-grid-retheme">Name</th>
              <th className="p-2 border table-grid-retheme">Category</th>
              <th className="p-2 border table-grid-retheme">Box Size</th>
              <th className="p-2 border table-grid-retheme">Units per Case</th>
              <th className="p-2 border table-grid-retheme">Cost Per Box</th>
              <th className="p-2 border table-grid-retheme">Wholesale Price</th>
              <th className="p-2 border table-grid-retheme">Profit Margin</th>
              <th className="p-2 border table-grid-retheme">Inventory</th>
              <th className="p-2 border table-grid-retheme">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={`border-b table-grid-retheme ${product.inventory < 10 ? 'bg-red-900' : ''}`}>
                <td className="p-2 border table-grid-retheme">{product.name}</td>
                <td className="p-2 border table-grid-retheme">{product.category}</td>
                <td className="p-2 border table-grid-retheme">{product.boxSize}</td>
                <td className="p-2 border table-grid-retheme">{product.unitsPerCase}</td>
                <td className="p-2 border table-grid-retheme">{product.costPerBox}</td>
                <td className="p-2 border table-grid-retheme">{product.wholesalePricePerBox}</td>
                <td className="p-2 border table-grid-retheme">{calculateProfitMargin(product.costPerBox, product.wholesalePricePerBox)}</td>
                <td className="p-2 border table-grid-retheme">{product.inventory}</td>
                <td className="p-2 border table-grid-retheme">
                    <button onClick={() => handleEdit(product)} className="text-gold hover:text-off-white"><FaPencilAlt /></button>
                    <button onClick={() => handleOpenUpdateInventoryModal(product)} className="text-gold hover:text-off-white ml-2"><FaBoxOpen /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 ml-2"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UpdateInventoryModal 
        isOpen={isInventoryModalOpen} 
        onClose={() => setIsInventoryModalOpen(false)} 
        product={currentProduct} 
        onSave={handleUpdateInventory} 
      />
    </div>
  );
};

export default Products;
