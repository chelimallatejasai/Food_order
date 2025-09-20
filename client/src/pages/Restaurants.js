import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaUtensils, FaStar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('');
  const [filterCity, setFilterCity] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterCuisine) params.append('cuisine', filterCuisine);
      if (filterCity) params.append('city', filterCity);
      
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
    fetchRestaurants();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCuisine('');
    setFilterCity('');
    fetchRestaurants();
  };

  if (loading) {
    return <div className="loading">Loading restaurants...</div>;
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 className="text-center mb-4">All Restaurants</h1>
        
        {/* Search and Filters */}
        <div className="card mb-4">
          <form onSubmit={handleSearch}>
            <div className="grid grid-2 mb-3">
              <div className="form-group">
                <label className="form-label">Search</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search restaurants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                  <FaSearch style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#666'
                  }} />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Cuisine</label>
                <select
                  className="form-control"
                  value={filterCuisine}
                  onChange={(e) => setFilterCuisine(e.target.value)}
                >
                  <option value="">All Cuisines</option>
                  <option value="Italian">Italian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Thai">Thai</option>
                  <option value="American">American</option>
                  <option value="Japanese">Japanese</option>
                </select>
              </div>
            </div>
            
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Search
              </button>
              <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {/* Restaurants Grid */}
        {restaurants.length === 0 ? (
          <div className="text-center">
            <FaUtensils style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }} />
            <h3>No restaurants found</h3>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {restaurants.map(restaurant => (
              <div key={restaurant._id} className="card">
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    background: '#f0f0f0',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: '#666',
                    flexShrink: 0
                  }}>
                    <FaUtensils />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>{restaurant.name}</h4>
                    <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                      <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
                      {restaurant.address.street}, {restaurant.address.city}
                    </p>
                    
                    <div className="d-flex align-items-center mb-2">
                      <FaStar style={{ color: '#ffc107', marginRight: '0.5rem' }} />
                      <span style={{ marginRight: '1rem' }}>{restaurant.rating.toFixed(1)}</span>
                      <span style={{ color: '#666' }}>
                        <FaClock style={{ marginRight: '0.5rem' }} />
                        30-45 min
                      </span>
                    </div>
                    
                    <p style={{ color: '#007bff', fontWeight: 'bold', marginBottom: '1rem' }}>
                      {restaurant.cuisine}
                    </p>
                    
                    {restaurant.description && (
                      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                        {restaurant.description.substring(0, 120)}...
                      </p>
                    )}
                    
                    <Link to={`/restaurant/${restaurant._id}`} className="btn btn-primary">
                      View Menu & Order
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
