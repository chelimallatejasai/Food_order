const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ customer: req.user._id })
      .populate({
        path: 'items.menuItem',
        populate: {
          path: 'restaurant',
          select: 'name address'
        }
      });

    if (!cart) {
      cart = new Cart({ customer: req.user._id, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', [
  auth,
  body('menuItemId').isMongoId().withMessage('Valid menu item ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { menuItemId, quantity } = req.body;

    // Check if menu item exists and is available
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem || !menuItem.isAvailable) {
      return res.status(404).json({ message: 'Menu item not found or not available' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ customer: req.user._id });
    if (!cart) {
      cart = new Cart({ 
        customer: req.user._id, 
        restaurant: menuItem.restaurant,
        items: [] 
      });
    }

    // Check if adding item from different restaurant
    if (cart.restaurant && cart.restaurant.toString() !== menuItem.restaurant.toString()) {
      return res.status(400).json({ 
        message: 'Cannot add items from different restaurants. Clear cart first.' 
      });
    }

    // Set restaurant if not set
    if (!cart.restaurant) {
      cart.restaurant = menuItem.restaurant;
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.menuItem.toString() === menuItemId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        menuItem: menuItemId,
        quantity: quantity
      });
    }

    await cart.save();

    // Populate the cart with menu item details
    await cart.populate({
      path: 'items.menuItem',
      populate: {
        path: 'restaurant',
        select: 'name address'
      }
    });

    res.json({
      message: 'Item added to cart successfully',
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cart/update/:itemId
// @desc    Update item quantity in cart
// @access  Private
router.put('/update/:itemId', [
  auth,
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quantity } = req.body;
    const cart = await Cart.findOne({ customer: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Populate the cart with menu item details
    await cart.populate({
      path: 'items.menuItem',
      populate: {
        path: 'restaurant',
        select: 'name address'
      }
    });

    res.json({
      message: 'Cart updated successfully',
      cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );

    // If cart is empty, remove restaurant reference
    if (cart.items.length === 0) {
      cart.restaurant = null;
    }

    await cart.save();

    // Populate the cart with menu item details
    await cart.populate({
      path: 'items.menuItem',
      populate: {
        path: 'restaurant',
        select: 'name address'
      }
    });

    res.json({
      message: 'Item removed from cart successfully',
      cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.restaurant = null;
    await cart.save();

    res.json({
      message: 'Cart cleared successfully',
      cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
