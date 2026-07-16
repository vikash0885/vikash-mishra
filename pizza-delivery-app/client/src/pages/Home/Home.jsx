import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { pizzaService } from '../../services/pizzaService';
import PizzaCard from '../../components/PizzaCard/PizzaCard';
import Spinner from '../../components/Spinner/Spinner';
import './Home.css';

const Home = () => {
  const [featuredPizzas, setFeaturedPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await pizzaService.getAllPizzas();
        // Just take the first 4 for featured
        setFeaturedPizzas(res.data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured pizzas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/menu?category=${category}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content animate-slide-in-right">
            <h1 className="hero-title">
              Freshly Baked,<br/>
              <span className="gradient-text">Delivered Hot 🍕</span>
            </h1>
            <p className="hero-subtitle">
              Experience the best authentic pizzas made with hand-tossed dough, 
              rich tomato sauce, and premium ingredients. Delivered right to your doorstep.
            </p>
            <div className="hero-buttons">
              <Link to="/menu" className="btn btn-primary">Order Now</Link>
              <a href="#how-it-works" className="btn btn-outline">Explore Menu</a>
            </div>
          </div>
          <div className="hero-image-wrapper animate-float">
            <img 
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Delicious Pizza" 
              className="hero-image"
            />
          </div>
        </div>
        <div className="hero-particles"></div>
      </section>

      {/* Featured Section */}
      <section className="featured-section container">
        <div className="section-header">
          <h2 className="section-title">🔥 Popular Picks</h2>
          <Link to="/menu" className="view-all-link">View All</Link>
        </div>
        
        {loading ? (
          <Spinner fullPage={false} />
        ) : (
          <div className="pizza-grid">
            {featuredPizzas.map(pizza => (
              <PizzaCard key={pizza._id} pizza={pizza} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="categories-section container">
        <h2 className="section-title text-center">Browse by Category</h2>
        <div className="categories-grid">
          <div className="category-card" onClick={() => handleCategoryClick('veg')}>
            <div className="category-icon">🥬</div>
            <h3>Veg Pizzas</h3>
            <p>Fresh & crispy vegetables</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('non-veg')}>
            <div className="category-icon">🍗</div>
            <h3>Non-Veg Pizzas</h3>
            <p>Loaded with premium meats</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('premium')}>
            <div className="category-icon">👑</div>
            <h3>Premium</h3>
            <p>Gourmet ingredients</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('classic')}>
            <div className="category-icon">🍕</div>
            <h3>Classics</h3>
            <p>The all-time favorites</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <h2 className="section-title text-center">How It Works</h2>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3>Choose Pizza</h3>
              <p>Browse our extensive menu and select your favorite pizza.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h3>Customize</h3>
              <p>Choose your size, crust, extra cheese, and toppings.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h3>Fast Delivery</h3>
              <p>Enjoy hot pizza delivered to your doorstep in 30 mins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-content">
          <h2>Ready to satisfy your cravings?</h2>
          <Link to="/menu" className="btn btn-primary" style={{ background: 'var(--dark-bg)', color: 'var(--text-primary)' }}>
            Order Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
