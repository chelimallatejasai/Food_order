import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaClock, FaCheckCircle, FaTimesCircle, FaTruck, FaUtensils } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const params = filter ? `?status=${filter}` : '';
      const response = await axios.get(`/api/orders${params}`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    try {
      await axios.put(`/api/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock style={{ color: '#ffc107' }} />;
      case 'confirmed':
        return <FaCheckCircle style={{ color: '#28a745' }} />;
      case 'preparing':
        return <FaUtensils style={{ color: '#007bff' }} />;
      case 'ready':
        return <FaTruck style={{ color: '#17a2b8' }} />;
      case 'delivered':
        return <FaCheckCircle style={{ color: '#28a745' }} />;
      case 'cancelled':
        return <FaTimesCircle style={{ color: '#dc3545' }} />;
      default:
        return <FaClock style={{ color: '#6c757d' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffc107';
      case 'confirmed':
        return '#28a745';
      case 'preparing':
        return '#007bff';
      case 'ready':
        return '#17a2b8';
      case 'delivered':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const canCancelOrder = (status) => {
    return ['pending', 'confirmed'].includes(status);
  };

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 className="mb-4">Your Orders</h1>
        
        {/* Filter */}
        <div className="card mb-4">
          <div className="d-flex align-items-center" style={{ gap: '1rem' }}>
            <label className="form-label mb-0">Filter by status:</label>
            <select
              className="form-control"
              style={{ width: '200px' }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="btn btn-secondary" onClick={fetchOrders}>
              Refresh
            </button>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center">
            <FaUtensils style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }} />
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet.</p>
            <Link to="/restaurants" className="btn btn-primary">
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-1">
            {orders.map(order => (
              <div key={order._id} className="card">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h4>{order.restaurant.name}</h4>
                    <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="d-flex align-items-center mb-2" style={{ gap: '0.5rem' }}>
                      {getStatusIcon(order.status)}
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

                {/* Order Items */}
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

                {/* Delivery Address */}
                <div style={{ marginBottom: '1rem' }}>
                  <h5>Delivery Address:</h5>
                  <p style={{ color: '#666', margin: 0 }}>
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                  </p>
                  {order.deliveryInstructions && (
                    <p style={{ color: '#666', marginTop: '0.5rem', fontStyle: 'italic' }}>
                      Instructions: {order.deliveryInstructions}
                    </p>
                  )}
                </div>

                {/* Estimated Delivery */}
                {order.estimatedDeliveryTime && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h5>Estimated Delivery:</h5>
                    <p style={{ color: '#666', margin: 0 }}>
                      {new Date(order.estimatedDeliveryTime).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {order.status === 'delivered' && order.actualDeliveryTime && (
                      <p style={{ color: '#28a745', margin: 0 }}>
                        Delivered on {new Date(order.actualDeliveryTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    {canCancelOrder(order.status) && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}
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

export default Orders;
