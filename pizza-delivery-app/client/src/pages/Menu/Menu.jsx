import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pizzaService } from '../../services/pizzaService';
import PizzaCard from '../../components/PizzaCard/PizzaCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Spinner from '../../components/Spinner/Spinner';
import './Menu.css';

const Menu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const initialCategory = queryParams.get('category') || 'All';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  const categories = ['All', 'Veg', 'Non-Veg', 'Premium', 'Classic'];

  useEffect(() => {
    // Sync state with URL params
    const categoryFromUrl = queryParams.get('category') || 'All';
    setActiveCategory(categoryFromUrl);
    fetchPizzas('', categoryFromUrl);
  }, [location.search]);

  const fetchPizzas = async (search = '', category = activeCategory) => {
    setLoading(true);
    try {
      const res = await pizzaService.getAllPizzas(search, category);
      setPizzas(res.data);
    } catch (error) {
      console.error('Failed to fetch menu', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    navigate(`/menu${category === 'All' ? '' : `?category=${category}`}`);
  };

  const handleSearch = (searchTerm) => {
    fetchPizzas(searchTerm, activeCategory);
  };

  return (
    <div className="menu-page container">
      <div className="menu-header">
        <h1 className="page-title">Our Menu</h1>
        <div className="menu-search-wrapper">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : pizzas.length === 0 ? (
        <div className="empty-menu">
          <div className="empty-icon">🍽️</div>
          <h3>No pizzas found</h3>
          <p className="text-muted">Try selecting a different category or clear your search.</p>
          <button className="btn btn-outline" onClick={() => handleCategoryChange('All')}>
            View All Pizzas
          </button>
        </div>
      ) : (
        <div className="pizza-grid">
          {pizzas.map((pizza) => (
            <PizzaCard key={pizza._id} pizza={pizza} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
