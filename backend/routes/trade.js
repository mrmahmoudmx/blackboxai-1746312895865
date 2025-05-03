const express = require('express');
const router = express.Router();
const tradeService = require('../services/tradeService');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get current BTC/USDT price
router.get('/price', async (req, res, next) => {
  try {
    const price = await tradeService.getCurrentPrice();
    if (!price) {
      throw new Error('Failed to get valid price from Binance API');
    }
    res.json({ price });
  } catch (error) {
    console.error('Price fetch error:', error);
    next(error); // Pass to error handling middleware
  }
});

// Execute buy order
router.post('/buy', async (req, res) => {
  try {
    const { amount, price } = req.body;
    if (!amount || !price) {
      return res.status(400).json({ error: 'Amount and price are required' });
    }
    
    const order = await tradeService.executeBuy({ amount, price });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Execute sell order
router.post('/sell', async (req, res) => {
  try {
    const { amount, price } = req.body;
    if (!amount || !price) {
      return res.status(400).json({ error: 'Amount and price are required' });
    }
    
    const order = await tradeService.executeSell({ amount, price });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order history
router.get('/history', async (req, res) => {
  try {
    const history = await tradeService.getOrderHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
