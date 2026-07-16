import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import './PizzaCard.css';

const PizzaCard = ({ pizza }) => {
  return (
    <div className="pizza-card animate-slide-up">
      <div className="pizza-card-image-wrapper">
        <img 
          src={pizza.image || 'https://via.placeholder.com/300x200?text=Pizza'} 
          alt={pizza.name} 
          className="pizza-card-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Pizza';
          }}
        />
        <div className="pizza-badges">
          <span className={`badge badge-${pizza.category}`}>{pizza.category}</span>
          <span className={`badge ${pizza.isVeg ? 'badge-veg' : 'badge-non-veg'}`}>
            {pizza.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>
      </div>
      
      <div className="pizza-card-content">
        <div className="pizza-card-header">
          <h3 className="pizza-name">{pizza.name}</h3>
          <div className="pizza-rating">
            <span>⭐</span> {pizza.rating.toFixed(1)}
          </div>
        </div>
        
        <p className="pizza-desc">{pizza.description}</p>
        
        <div className="pizza-card-footer">
          <div className="pizza-price-container">
            <span className="price-label">Starts at</span>
            <span className="pizza-price">{formatPrice(pizza.prices.small)}</span>
          </div>
          
          <Link to={`/pizza/${pizza._id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;
