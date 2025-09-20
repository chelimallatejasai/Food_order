<<<<<<< HEAD
# Foodiez - Online Food Ordering System

A comprehensive food ordering system built with Node.js, Express, React, and MongoDB.

## Features

### Customer Features
- **User Authentication**: Sign up and login for customers
- **Restaurant Browsing**: Browse restaurants by cuisine, location, and search
- **Menu Viewing**: View restaurant menus with categories
- **Shopping Cart**: Add items to cart with quantity management
- **Order Placement**: Place orders with delivery information
- **Order Tracking**: View order history and status
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Admin Panel**: Complete restaurant and menu management
- **Restaurant Management**: Add, edit, delete restaurants
- **Menu Management**: Add, edit, delete menu items
- **Order Management**: View and update order status
- **User Management**: Admin role-based access

### Order Status Tracking
- Pending → Confirmed → Preparing → Ready → Delivered
- Order cancellation for pending/confirmed orders
- Estimated delivery times

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `config.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/foodiez
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React app:**
   ```bash
   npm start
   ```

### Database Setup

1. **Install MongoDB** (if running locally):
   - Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas for cloud database

2. **Start MongoDB service:**
   ```bash
   # On Windows
   net start MongoDB

   # On macOS/Linux
   sudo systemctl start mongod
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get single restaurant
- `POST /api/restaurants` - Create restaurant (Admin)
- `PUT /api/restaurants/:id` - Update restaurant (Admin)
- `DELETE /api/restaurants/:id` - Delete restaurant (Admin)

### Menu Items
- `GET /api/menu/restaurant/:restaurantId` - Get restaurant menu
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/admin/all` - Get all orders (Admin)

## Usage

### For Customers
1. **Register/Login**: Create an account or login
2. **Browse Restaurants**: Search and filter restaurants
3. **View Menu**: Click on restaurant to see menu items
4. **Add to Cart**: Add items with desired quantities
5. **Checkout**: Provide delivery address and place order
6. **Track Orders**: View order history and status

### For Admins
1. **Login as Admin**: Use admin role during registration
2. **Manage Restaurants**: Add, edit, delete restaurants
3. **Manage Menu Items**: Add, edit, delete menu items for restaurants
4. **Manage Orders**: View all orders and update status

## Project Structure

```
foodiez/
├── server.js                 # Main server file
├── package.json             # Backend dependencies
├── config.env               # Environment variables
├── models/                  # Database models
│   ├── User.js
│   ├── Restaurant.js
│   ├── MenuItem.js
│   ├── Order.js
│   └── Cart.js
├── routes/                  # API routes
│   ├── auth.js
│   ├── restaurants.js
│   ├── menu.js
│   ├── cart.js
│   └── orders.js
├── middleware/              # Custom middleware
│   └── auth.js
└── client/                  # React frontend
    ├── package.json
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        ├── context/
        └── App.js
```

## Features Implementation

### Authentication System
- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (Customer/Admin)
- Protected routes

### Cart Functionality
- Persistent cart across sessions
- Quantity management
- Restaurant-specific cart (one restaurant at a time)
- Real-time cart updates

### Order Management
- Complete order lifecycle
- Status tracking with timestamps
- Delivery address management
- Order cancellation

### Admin Panel
- Comprehensive restaurant management
- Menu item management with categories
- Order status management
- Real-time updates

## Error Handling
- Comprehensive error handling on both frontend and backend
- User-friendly error messages
- Input validation
- Database error handling

## Security Features
- Password hashing
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Protected admin routes

## Development

### Running in Development Mode
```bash
# Backend
npm run dev

# Frontend (in separate terminal)
cd client
npm start
```

### Production Build
```bash
# Build React app
cd client
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
=======
# Food_order
>>>>>>> 8c0e72eb265998da5b21852567075c2829e65a25

