require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tradeRoutes = require('./routes/trade');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/trade', tradeRoutes);
app.use('/api/auth', authRoutes);

const fs = require('fs');
const path = require('path');

// Error handling middleware with logging
app.use((err, req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ${err.stack}\n`;
  console.error(logMessage);
  fs.appendFile(path.join(__dirname, 'error.log'), logMessage, (error) => {
    if (error) console.error('Failed to write to log file:', error);
  });
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
