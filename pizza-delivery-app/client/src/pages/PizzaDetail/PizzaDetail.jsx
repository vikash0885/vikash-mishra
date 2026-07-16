import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { pizzaService } from '../../services/pizzaService';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import Spinner from '../../components/Spinner/Spinner';
import './PizzaDetail.css';

const PizzaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [size, setSize] = useState('Medium');
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState({
    base: 'Thin Crust',
    sauce: 'Tomato',
    cheese: 'Mozzarella',
    vegetables: []
  });

  useEffect(() => {
    const fetchPizza = async () => {
      try {
        const res = await pizzaService.getPizzaById(id);
        setPizza(res.data);
      } catch (err) {
        setError('Pizza not found or server error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPizza();
  }, [id]);

  const handleCustomizationChange = (type, value) => {
    setCustomizations(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleVeggieToggle = (veg) => {
    setCustomizations(prev => {
      const isSelected = prev.vegetables.includes(veg);
      const newVeggies = isSelected
        ? prev.vegetables.filter(v => v !== veg)
        : [...prev.vegetables, veg];
      
      return { ...prev, vegetables: newVeggies };
    });
  };

  const handleAddToCart = () => {
    addToCart(pizza, size, quantity, customizations);
    // Optionally navigate to cart or stay
  };

  if (loading) return <Spinner />;
  if (error || !pizza) return (
    <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
      <h2>{error || 'Not found'}</h2>
      <Link to="/menu" className="btn btn-outline" style={{ marginTop: '1rem' }}>Back to Menu</Link>
    </div>
  );

  const bases = ['Thin Crust', 'Thick Crust', 'Cheese Burst', 'Whole Wheat'];
  const sauces = ['Tomato', 'Pesto', 'BBQ', 'White Garlic'];
  const cheeses = ['Mozzarella', 'Cheddar', 'Parmesan', 'Gouda'];
  const veggies = ['Onion', 'Capsicum', 'Mushroom', 'Olive', 'Jalapeno', 'Corn', 'Tomato', 'Spinach'];

  const currentPrice = pizza.prices[size.toLowerCase()];

  return (
    <div className="pizza-detail-page container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </button>

      <div className="detail-grid">
        <div className="detail-image-col animate-slide-in-right">
          <div className="detail-image-wrapper">
            <img 
              src={pizza.image || 'https://via.placeholder.com/600?text=Pizza'} 
              alt={pizza.name} 
            />
          </div>
        </div>

        <div className="detail-info-col animate-slide-up">
          <div className="detail-header">
            <div className="badges">
              <span className={`badge badge-${pizza.category}`}>{pizza.category}</span>
              <span className={`badge ${pizza.isVeg ? 'badge-veg' : 'badge-non-veg'}`}>
                {pizza.isVeg ? 'Veg' : 'Non-Veg'}
              </span>
            </div>
            <h1 className="detail-title">{pizza.name}</h1>
            <div className="detail-rating">⭐ {pizza.rating.toFixed(1)}</div>
            <p className="detail-desc">{pizza.description}</p>
          </div>

          <div className="detail-section">
            <h3 className="section-label">Select Size</h3>
            <div className="size-selector">
              {['Small', 'Medium', 'Large'].map(sz => (
                <button
                  key={sz}
                  className={`size-btn ${size === sz ? 'active' : ''}`}
                  onClick={() => setSize(sz)}
                >
                  <span className="size-name">{sz}</span>
                  <span className="size-price">{formatPrice(pizza.prices[sz.toLowerCase()])}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-label">Crust</h3>
            <div className="radio-group">
              {bases.map(b => (
                <label key={b} className="custom-radio">
                  <input 
                    type="radio" 
                    name="base" 
                    checked={customizations.base === b}
                    onChange={() => handleCustomizationChange('base', b)}
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-label">Sauce</h3>
            <div className="radio-group">
              {sauces.map(s => (
                <label key={s} className="custom-radio">
                  <input 
                    type="radio" 
                    name="sauce" 
                    checked={customizations.sauce === s}
                    onChange={() => handleCustomizationChange('sauce', s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-label">Extra Cheese</h3>
            <div className="radio-group">
              {cheeses.map(c => (
                <label key={c} className="custom-radio">
                  <input 
                    type="radio" 
                    name="cheese" 
                    checked={customizations.cheese === c}
                    onChange={() => handleCustomizationChange('cheese', c)}
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-label">Veggies</h3>
            <div className="checkbox-group">
              {veggies.map(v => (
                <label key={v} className="custom-checkbox">
                  <input 
                    type="checkbox"
                    checked={customizations.vegetables.includes(v)}
                    onChange={() => handleVeggieToggle(v)}
                  />
                  <span>{v}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="detail-footer">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FiMinus /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}><FiPlus /></button>
            </div>
            
            <div className="total-add">
              <div className="detail-total-price">
                {formatPrice(currentPrice * quantity)}
              </div>
              <button className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart}>
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PizzaDetail;
