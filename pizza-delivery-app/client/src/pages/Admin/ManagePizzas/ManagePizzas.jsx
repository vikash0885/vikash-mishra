import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import Spinner from '../../../components/Spinner/Spinner';
import { formatPrice } from '../../../utils/helpers';
import { useToast } from '../../../context/ToastContext';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import './ManagePizzas.css';

const ManagePizzas = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPizza, setEditingPizza] = useState(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Veg',
    isVeg: true,
    priceSmall: '',
    priceMedium: '',
    priceLarge: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      const res = await adminService.getAllPizzas();
      setPizzas(res.data);
    } catch (error) {
      console.error(error);
      showToast('Failed to fetch pizzas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pizza = null) => {
    if (pizza) {
      setEditingPizza(pizza);
      setFormData({
        name: pizza.name,
        description: pizza.description,
        category: pizza.category,
        isVeg: pizza.isVeg,
        priceSmall: pizza.prices.small,
        priceMedium: pizza.prices.medium,
        priceLarge: pizza.prices.large
      });
    } else {
      setEditingPizza(null);
      setFormData({
        name: '',
        description: '',
        category: 'Veg',
        isVeg: true,
        priceSmall: '',
        priceMedium: '',
        priceLarge: ''
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPizza(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('isVeg', formData.isVeg);
    data.append('prices[small]', formData.priceSmall);
    data.append('prices[medium]', formData.priceMedium);
    data.append('prices[large]', formData.priceLarge);
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingPizza) {
        const res = await adminService.updatePizza(editingPizza._id, data);
        setPizzas(pizzas.map(p => p._id === editingPizza._id ? res.data : p));
        showToast('Pizza updated successfully', 'success');
      } else {
        const res = await adminService.addPizza(data);
        setPizzas([...pizzas, res.data]);
        showToast('Pizza added successfully', 'success');
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Failed to save pizza', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pizza?')) return;
    setLoading(true);
    try {
      await adminService.deletePizza(id);
      setPizzas(pizzas.filter(p => p._id !== id));
      showToast('Pizza deleted successfully', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to delete pizza', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && pizzas.length === 0) return <Spinner />;

  return (
    <div className="manage-pizzas animate-fade-in">
      <div className="page-header-actions">
        <h2>Menu Management</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FiPlus /> Add Pizza
        </button>
      </div>

      <div className="admin-card mt-4">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Type</th>
                <th>Prices (S/M/L)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pizzas.map((pizza) => (
                <tr key={pizza._id}>
                  <td>
                    <img 
                      src={pizza.image || 'https://via.placeholder.com/50'} 
                      alt={pizza.name} 
                      className="pizza-thumb"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50';
                      }}
                    />
                  </td>
                  <td>
                    <div className="pizza-info-cell">
                      <span className="font-bold">{pizza.name}</span>
                      <span className="desc-text text-muted text-xs">{pizza.description}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${pizza.category.toLowerCase()}`}>{pizza.category}</span>
                  </td>
                  <td>
                    <span className={`badge ${pizza.isVeg ? 'badge-veg' : 'badge-non-veg'}`}>
                      {pizza.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </td>
                  <td>
                    {formatPrice(pizza.prices.small)} / {formatPrice(pizza.prices.medium)} / {formatPrice(pizza.prices.large)}
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-icon-action edit" onClick={() => handleOpenModal(pizza)} title="Edit">
                        <FiEdit2 />
                      </button>
                      <button className="btn-icon-action delete" onClick={() => handleDelete(pizza._id)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pizzas.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No pizzas in database. Add some!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-scale-in">
            <h3>{editingPizza ? 'Edit Pizza' : 'Add New Pizza'}</h3>
            <form onSubmit={handleSubmit} className="pizza-form">
              <div className="form-group">
                <label className="form-label">Pizza Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Premium">Premium</option>
                    <option value="Classic">Classic</option>
                  </select>
                </div>
                
                <div className="form-group check-group">
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      name="isVeg"
                      checked={formData.isVeg}
                      onChange={handleChange}
                    />
                    <span>Is Vegetarian?</span>
                  </label>
                </div>
              </div>

              <div className="prices-input-row">
                <div className="form-group">
                  <label className="form-label">Small Price (₹)</label>
                  <input
                    type="number"
                    name="priceSmall"
                    className="form-control"
                    value={formData.priceSmall}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Medium Price (₹)</label>
                  <input
                    type="number"
                    name="priceMedium"
                    className="form-control"
                    value={formData.priceMedium}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Large Price (₹)</label>
                  <input
                    type="number"
                    name="priceLarge"
                    className="form-control"
                    value={formData.priceLarge}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pizza Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPizza ? 'Update Pizza' : 'Add Pizza'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePizzas;
