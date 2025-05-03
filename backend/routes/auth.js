const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock user for demo purposes
// In production, you would use a database
const MOCK_USER = {
  id: 1,
  username: 'trader',
  password: 'password123'
};

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check credentials (mock authentication)
  if (username === MOCK_USER.username && password === MOCK_USER.password) {
    // Create JWT token
    const token = jwt.sign(
      { id: MOCK_USER.id, username: MOCK_USER.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: MOCK_USER.id,
        username: MOCK_USER.username
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

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

// Protected route example
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username
    }
  });
});

module.exports = router;
