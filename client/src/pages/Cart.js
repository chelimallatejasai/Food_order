import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaMinus, FaTrash, FaShoppingBag } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, getCartTotal, fetchCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || ''
  });
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const result = await updateCartItem(itemId, newQuantity);
    if (!result.success) {
      toast.error(result.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    const result = await removeFromCart(itemId);
    if (result.success) {
      toast.success('Item removed from cart');
    } else {
      toast.error(result.message);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zipCode) {
      toast.error('Please fill in all delivery address fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('/api/orders', {
        deliveryAddress,
        deliveryInstructions
      });
      
      toast.success('Order placed successfully!');
      await fetchCart(); // Refresh cart
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ padding: '4rem 0', minHeight: '60vh' }}>
        <div className="container">
          <div className="text-center">
            <FaShoppingBag style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }} />
            <h2>Your cart is empty</h2>
            <p>Add some delicious items to get started!</p>
            <Link to="/restaurants" className="btn btn-primary">
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 className="mb-4">Your Cart</h1>
        
        <div className="grid grid-2">
          {/* Cart Items */}
          <div>
            <div className="card">
              <h3>Order from {cart.restaurant?.name}</h3>
              
              {cart.items.map(item => (
                <div key={item._id} style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#f0f0f0',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: '#666',
                    flexShrink: 0
                  }}>
                    🍕
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>{item.menuItem.name}</h4>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      {item.menuItem.description}
                    </p>
                    <p style={{ color: '#007bff', fontWeight: 'bold' }}>
                      ${item.menuItem.price.toFixed(2)} each
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div className="d-flex align-items-center mb-2" style={{ gap: '0.5rem' }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span style={{ minWidth: '30px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </p>
                    
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              
              <div style={{
                paddingTop: '1rem',
                borderTop: '2px solid #007bff',
                marginTop: '1rem'
              }}>
                <div className="d-flex justify-content-between">
                  <h3>Total: ${getCartTotal().toFixed(2)}</h3>
                </div>
              </div>
            </div>
          </div>
          
          {/* Checkout Form */}
          <div>
            <div className="card">
              <h3>Delivery Information</h3>
              
              <form onSubmit={handleCheckout}>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress({
                      ...deliveryAddress,
                      street: e.target.value
                    })}
                    required
                  />
                </div>
                
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({
                        ...deliveryAddress,
                        city: e.target.value
                      })}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={deliveryAddress.state}
                      onChange={(e) => setDeliveryAddress({
                        ...deliveryAddress,
                        state: e.target.value
                      })}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={deliveryAddress.zipCode}
                    onChange={(e) => setDeliveryAddress({
                      ...deliveryAddress,
                      zipCode: e.target.value
                    })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Delivery Instructions (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-success"
                  style={{ width: '100%' }}
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : `Place Order - $${getCartTotal().toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
