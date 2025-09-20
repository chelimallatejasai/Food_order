import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUtensils, FaStore } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');

  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    address: { street: '', city: '', state: '', zipCode: '' },
    cuisine: '',
    phone: '',
    email: '',
    description: ''
  });

  const [menuItemForm, setMenuItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main_course',
    restaurant: '',
    preparationTime: 15
  });

  useEffect(() => {
    fetchRestaurants();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchMenuItems();
    }
  }, [selectedRestaurant]);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('/api/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`/api/menu/restaurant/${selectedRestaurant}`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/admin/all');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingRestaurant) {
        await axios.put(`/api/restaurants/${editingRestaurant._id}`, restaurantForm);
        toast.success('Restaurant updated successfully');
      } else {
        await axios.post('/api/restaurants', restaurantForm);
        toast.success('Restaurant created successfully');
      }
      
      setShowRestaurantForm(false);
      setEditingRestaurant(null);
      setRestaurantForm({
        name: '',
        address: { street: '', city: '', state: '', zipCode: '' },
        cuisine: '',
        phone: '',
        email: '',
        description: ''
      });
      fetchRestaurants();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuItemSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingMenuItem) {
        await axios.put(`/api/menu/${editingMenuItem._id}`, menuItemForm);
        toast.success('Menu item updated successfully');
      } else {
        await axios.post('/api/menu', menuItemForm);
        toast.success('Menu item created successfully');
      }
      
      setShowMenuItemForm(false);
      setEditingMenuItem(null);
      setMenuItemForm({
        name: '',
        description: '',
        price: '',
        category: 'main_course',
        restaurant: selectedRestaurant,
        preparationTime: 15
      });
      fetchMenuItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) {
      return;
    }

    try {
      await axios.delete(`/api/restaurants/${id}`);
      toast.success('Restaurant deleted successfully');
      fetchRestaurants();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete restaurant');
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      await axios.delete(`/api/menu/${id}`);
      toast.success('Menu item deleted successfully');
      fetchMenuItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'preparing': return '#007bff';
      case 'ready': return '#17a2b8';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 className="mb-4">Admin Panel</h1>
        
        {/* Tabs */}
        <div className="card mb-4">
          <div className="d-flex" style={{ gap: '1rem' }}>
            <button
              className={`btn ${activeTab === 'restaurants' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('restaurants')}
            >
              <FaStore /> Restaurants
            </button>
            <button
              className={`btn ${activeTab === 'menu' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('menu')}
            >
              <FaUtensils /> Menu Items
            </button>
            <button
              className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
          </div>
        </div>

        {/* Restaurants Tab */}
        {activeTab === 'restaurants' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Restaurants</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowRestaurantForm(true);
                  setEditingRestaurant(null);
                  setRestaurantForm({
                    name: '',
                    address: { street: '', city: '', state: '', zipCode: '' },
                    cuisine: '',
                    phone: '',
                    email: '',
                    description: ''
                  });
                }}
              >
                <FaPlus /> Add Restaurant
              </button>
            </div>

            {showRestaurantForm && (
              <div className="card mb-4">
                <h3>{editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
                <form onSubmit={handleRestaurantSubmit}>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Restaurant Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={restaurantForm.name}
                        onChange={(e) => setRestaurantForm({...restaurantForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cuisine</label>
                      <input
                        type="text"
                        className="form-control"
                        value={restaurantForm.cuisine}
                        onChange={(e) => setRestaurantForm({...restaurantForm, cuisine: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={restaurantForm.address.street}
                      onChange={(e) => setRestaurantForm({
                        ...restaurantForm,
                        address: {...restaurantForm.address, street: e.target.value}
                      })}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-3">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={restaurantForm.address.city}
                        onChange={(e) => setRestaurantForm({
                          ...restaurantForm,
                          address: {...restaurantForm.address, city: e.target.value}
                        })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={restaurantForm.address.state}
                        onChange={(e) => setRestaurantForm({
                          ...restaurantForm,
                          address: {...restaurantForm.address, state: e.target.value}
                        })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">ZIP Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={restaurantForm.address.zipCode}
                        onChange={(e) => setRestaurantForm({
                          ...restaurantForm,
                          address: {...restaurantForm.address, zipCode: e.target.value}
                        })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={restaurantForm.phone}
                        onChange={(e) => setRestaurantForm({...restaurantForm, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={restaurantForm.email}
                        onChange={(e) => setRestaurantForm({...restaurantForm, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={restaurantForm.description}
                      onChange={(e) => setRestaurantForm({...restaurantForm, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="d-flex" style={{ gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Saving...' : (editingRestaurant ? 'Update Restaurant' : 'Add Restaurant')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowRestaurantForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-2">
              {restaurants.map(restaurant => (
                <div key={restaurant._id} className="card">
                  <h4>{restaurant.name}</h4>
                  <p style={{ color: '#666' }}>{restaurant.cuisine}</p>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    {restaurant.address.street}, {restaurant.address.city}
                  </p>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    {restaurant.phone} • {restaurant.email}
                  </p>
                  
                  <div className="d-flex" style={{ gap: '0.5rem' }}>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setEditingRestaurant(restaurant);
                        setRestaurantForm({
                          name: restaurant.name,
                          address: restaurant.address,
                          cuisine: restaurant.cuisine,
                          phone: restaurant.phone,
                          email: restaurant.email,
                          description: restaurant.description || ''
                        });
                        setShowRestaurantForm(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteRestaurant(restaurant._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items Tab */}
        {activeTab === 'menu' && (
          <div>
            <div className="card mb-4">
              <div className="form-group">
                <label className="form-label">Select Restaurant</label>
                <select
                  className="form-control"
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                >
                  <option value="">Select a restaurant</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant._id} value={restaurant._id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedRestaurant && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2>Menu Items</h2>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setShowMenuItemForm(true);
                      setEditingMenuItem(null);
                      setMenuItemForm({
                        name: '',
                        description: '',
                        price: '',
                        category: 'main_course',
                        restaurant: selectedRestaurant,
                        preparationTime: 15
                      });
                    }}
                  >
                    <FaPlus /> Add Menu Item
                  </button>
                </div>

                {showMenuItemForm && (
                  <div className="card mb-4">
                    <h3>{editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
                    <form onSubmit={handleMenuItemSubmit}>
                      <div className="grid grid-2">
                        <div className="form-group">
                          <label className="form-label">Item Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={menuItemForm.name}
                            onChange={(e) => setMenuItemForm({...menuItemForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Price</label>
                          <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={menuItemForm.price}
                            onChange={(e) => setMenuItemForm({...menuItemForm, price: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={menuItemForm.description}
                          onChange={(e) => setMenuItemForm({...menuItemForm, description: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-2">
                        <div className="form-group">
                          <label className="form-label">Category</label>
                          <select
                            className="form-control"
                            value={menuItemForm.category}
                            onChange={(e) => setMenuItemForm({...menuItemForm, category: e.target.value})}
                          >
                            <option value="appetizer">Appetizer</option>
                            <option value="main_course">Main Course</option>
                            <option value="dessert">Dessert</option>
                            <option value="beverage">Beverage</option>
                            <option value="salad">Salad</option>
                            <option value="soup">Soup</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Preparation Time (minutes)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={menuItemForm.preparationTime}
                            onChange={(e) => setMenuItemForm({...menuItemForm, preparationTime: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="d-flex" style={{ gap: '1rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                          {loading ? 'Saving...' : (editingMenuItem ? 'Update Item' : 'Add Item')}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setShowMenuItemForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-2">
                  {menuItems.map(item => (
                    <div key={item._id} className="card">
                      <h4>{item.name}</h4>
                      <p style={{ color: '#666' }}>{item.description}</p>
                      <p style={{ color: '#007bff', fontWeight: 'bold' }}>${item.price}</p>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        {item.category.replace('_', ' ').toUpperCase()} • {item.preparationTime} min
                      </p>
                      
                      <div className="d-flex" style={{ gap: '0.5rem' }}>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setEditingMenuItem(item);
                            setMenuItemForm({
                              name: item.name,
                              description: item.description,
                              price: item.price,
                              category: item.category,
                              restaurant: selectedRestaurant,
                              preparationTime: item.preparationTime
                            });
                            setShowMenuItemForm(true);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteMenuItem(item._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="mb-4">All Orders</h2>
            
            <div className="grid grid-1">
              {orders.map(order => (
                <div key={order._id} className="card">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h4>Order #{order._id.slice(-8).toUpperCase()}</h4>
                      <p style={{ color: '#666' }}>Customer: {order.customer.name}</p>
                      <p style={{ color: '#666' }}>Restaurant: {order.restaurant.name}</p>
                      <p style={{ color: '#666' }}>
                        Placed: {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="d-flex align-items-center mb-2" style={{ gap: '0.5rem' }}>
                        <span style={{ 
                          color: getStatusColor(order.status),
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}>
                          {order.status}
                        </span>
                      </div>
                      <h3 style={{ color: '#007bff' }}>${order.totalAmount.toFixed(2)}</h3>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <h5>Items:</h5>
                    {order.items.map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid #eee'
                      }}>
                        <span>{item.menuItem.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>Delivery Address:</h5>
                      <p style={{ color: '#666', margin: 0 }}>
                        {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                      </p>
                    </div>
                    
                    <div>
                      <label className="form-label">Update Status:</label>
                      <select
                        className="form-control"
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
