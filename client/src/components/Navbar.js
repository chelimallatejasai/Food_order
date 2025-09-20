import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar" style={{
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
            <h2 style={{ margin: 0, color: '#007bff' }}>🍔 Foodiez</h2>
          </Link>

          {/* Desktop Menu */}
          <div className="d-none d-md-flex align-items-center" style={{ gap: '2rem' }}>
            <Link to="/restaurants" className="btn btn-secondary">Restaurants</Link>
            
            {user ? (
              <>
                <Link to="/cart" className="btn btn-primary d-flex align-items-center" style={{ gap: '0.5rem' }}>
                  <FaShoppingCart />
                  Cart ({cartCount})
                </Link>
                <Link to="/orders" className="btn btn-secondary">My Orders</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn btn-success">Admin Panel</Link>
                )}
                <div className="dropdown">
                  <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <FaUser /> {user.name}
                  </button>
                  <ul className="dropdown-menu">
                    <li><button className="dropdown-item" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button></li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/register" className="btn btn-secondary">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="d-md-none btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem' }}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="d-md-none mt-3" style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <div className="d-flex flex-column" style={{ gap: '1rem' }}>
              <Link to="/restaurants" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>
                Restaurants
              </Link>
              
              {user ? (
                <>
                  <Link to="/cart" className="btn btn-primary d-flex align-items-center justify-content-center" style={{ gap: '0.5rem' }}>
                    <FaShoppingCart />
                    Cart ({cartCount})
                  </Link>
                  <Link to="/orders" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>
                    My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="btn btn-success" onClick={() => setIsMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <button className="btn btn-outline-secondary" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
