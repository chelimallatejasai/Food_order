import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaUtensils, FaClock, FaStar } from 'react-icons/fa';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterCuisine) params.append('cuisine', filterCuisine);
      
      const response = await axios.get(`/api/restaurants?${params}`);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchRestaurants();
  };

  const handleCuisineFilter = (cuisine) => {
    setFilterCuisine(cuisine);
    setLoading(true);
    fetchRestaurants();
  };

  if (loading) {
    return <div className="loading">Loading restaurants...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to Foodiez</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            Discover amazing restaurants and order your favorite food online
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Search restaurants or cuisine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: '15px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '15px 30px' }}>
                <FaSearch />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Cuisine Filters */}
      <section style={{ padding: '2rem 0', background: '#f8f9fa' }}>
        <div className="container">
          <h3 className="text-center mb-4">Popular Cuisines</h3>
          <div className="d-flex justify-content-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
            {['Italian', 'Chinese', 'Indian', 'Mexican', 'Thai', 'American', 'Japanese'].map(cuisine => (
              <button
                key={cuisine}
                className={`btn ${filterCuisine === cuisine ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleCuisineFilter(filterCuisine === cuisine ? '' : cuisine)}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <h2 className="text-center mb-4">Featured Restaurants</h2>
          
          {restaurants.length === 0 ? (
            <div className="text-center">
              <p>No restaurants found. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {restaurants.map(restaurant => (
                <div key={restaurant._id} className="card">
                  <div style={{ height: '200px', background: '#f0f0f0', borderRadius: '5px', marginBottom: '1rem' }}>
                    {/* Restaurant Image Placeholder */}
                    <div style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      color: '#666'
                    }}>
                      <FaUtensils />
                    </div>
                  </div>
                  
                  <h4>{restaurant.name}</h4>
                  <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                    {restaurant.cuisine} • {restaurant.address.city}
                  </p>
                  
                  <div className="d-flex align-items-center mb-3">
                    <FaStar style={{ color: '#ffc107', marginRight: '0.5rem' }} />
                    <span>{restaurant.rating.toFixed(1)}</span>
                    <span style={{ marginLeft: '1rem', color: '#666' }}>
                      <FaClock /> 30-45 min
                    </span>
                  </div>
                  
                  {restaurant.description && (
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                      {restaurant.description.substring(0, 100)}...
                    </p>
                  )}
                  
                  <Link to={`/restaurant/${restaurant._id}`} className="btn btn-primary" style={{ width: '100%' }}>
                    View Menu
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
