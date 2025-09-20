import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaClock, FaMapMarkerAlt, FaPhone, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    fetchRestaurant();
    fetchMenuItems();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const response = await axios.get(`/api/restaurants/${id}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      toast.error('Failed to load restaurant details');
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`/api/menu/restaurant/${id}`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (menuItem) => {
    const quantity = quantities[menuItem._id] || 1;
    const result = await addToCart(menuItem._id, quantity);
    
    if (result.success) {
      toast.success(`${menuItem.name} added to cart!`);
      setQuantities({ ...quantities, [menuItem._id]: 1 });
    } else {
      toast.error(result.message);
    }
  };

  const updateQuantity = (menuItemId, change) => {
    const currentQuantity = quantities[menuItemId] || 1;
    const newQuantity = Math.max(1, currentQuantity + change);
    setQuantities({ ...quantities, [menuItemId]: newQuantity });
  };

  const getCategories = () => {
    const categories = [...new Set(menuItems.map(item => item.category))];
    return categories;
  };

  const getFilteredMenuItems = () => {
    if (!selectedCategory) return menuItems;
    return menuItems.filter(item => item.category === selectedCategory);
  };

  if (loading) {
    return <div className="loading">Loading restaurant details...</div>;
  }

  if (!restaurant) {
    return (
      <div className="container">
        <div className="error">
          <h2>Restaurant not found</h2>
          <p>The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Restaurant Header */}
        <div className="card mb-4">
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{
              width: '150px',
              height: '150px',
              background: '#f0f0f0',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: '#666',
              flexShrink: 0
            }}>
              🍽️
            </div>
            
            <div style={{ flex: 1 }}>
              <h1 style={{ marginBottom: '0.5rem' }}>{restaurant.name}</h1>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
                {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state}
              </p>
              
              <div className="d-flex align-items-center mb-2">
                <FaStar style={{ color: '#ffc107', marginRight: '0.5rem' }} />
                <span style={{ marginRight: '1rem' }}>{restaurant.rating.toFixed(1)}</span>
                <span style={{ color: '#666', marginRight: '1rem' }}>
                  <FaClock style={{ marginRight: '0.5rem' }} />
                  30-45 min
                </span>
                <span style={{ color: '#007bff', fontWeight: 'bold' }}>
                  {restaurant.cuisine}
                </span>
              </div>
              
              {restaurant.phone && (
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                  <FaPhone style={{ marginRight: '0.5rem' }} />
                  {restaurant.phone}
                </p>
              )}
              
              {restaurant.description && (
                <p style={{ color: '#666' }}>{restaurant.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="card mb-4">
          <h3>Menu Categories</h3>
          <div className="d-flex" style={{ gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className={`btn ${!selectedCategory ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory('')}
            >
              All Items
            </button>
            {getCategories().map(category => (
              <button
                key={category}
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-2">
          {getFilteredMenuItems().map(menuItem => (
            <div key={menuItem._id} className="card">
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: '#f0f0f0',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: '#666',
                  flexShrink: 0
                }}>
                  🍕
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>{menuItem.name}</h4>
                  <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    {menuItem.description}
                  </p>
                  <p style={{ color: '#007bff', fontWeight: 'bold', marginBottom: '1rem' }}>
                    ${menuItem.price.toFixed(2)}
                  </p>
                  
                  <div className="d-flex align-items-center" style={{ gap: '1rem' }}>
                    <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => updateQuantity(menuItem._id, -1)}
                        disabled={!quantities[menuItem._id] || quantities[menuItem._id] <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span style={{ minWidth: '30px', textAlign: 'center' }}>
                        {quantities[menuItem._id] || 1}
                      </span>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => updateQuantity(menuItem._id, 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(menuItem)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {getFilteredMenuItems().length === 0 && (
          <div className="text-center">
            <p>No menu items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
