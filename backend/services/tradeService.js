const axios = require('axios');

// Mock order database (in production, use a real database)
let orderHistory = [];

class TradeService {
  constructor() {
    this.baseUrl = 'https://api.binance.com/api/v3';
  }

  // Get current BTC/USDT price from alternative public API (CoinGecko)
  async getCurrentPrice() {
    try {
      console.log('Fetching price from CoinGecko API...');
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: 'bitcoin',
          vs_currencies: 'usd',
        },
        timeout: 5000,
      });

      if (!response.data || !response.data.bitcoin || !response.data.bitcoin.usd) {
        console.error('Invalid response from CoinGecko:', response.data);
        throw new Error('Invalid response from CoinGecko API');
      }

      const price = parseFloat(response.data.bitcoin.usd);
      if (isNaN(price)) {
        console.error('Invalid price value from CoinGecko:', response.data.bitcoin.usd);
        throw new Error('Invalid price format from CoinGecko API');
      }

      console.log('Successfully fetched price from CoinGecko:', price);
      return price;
    } catch (error) {
      if (error.response) {
        console.error('CoinGecko API error response:', {
          status: error.response.status,
          data: error.response.data,
        });
        throw new Error(`CoinGecko API error: ${error.response.data.error || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received from CoinGecko API');
        throw new Error('Could not reach CoinGecko API. Please check your connection.');
      } else {
        console.error('Error setting up request to CoinGecko:', error.message);
        throw new Error(`Error fetching price: ${error.message}`);
      }
    }
  }

  // Execute a buy order
  async executeBuy({ amount, price }) {
    try {
      // In production, this would call your exchange's API
      const order = {
        id: Date.now().toString(),
        type: 'BUY',
        amount,
        price,
        timestamp: new Date().toISOString(),
        status: 'COMPLETED'
      };

      // Store in mock database
      orderHistory.push(order);
      return order;
    } catch (error) {
      throw new Error('Failed to execute buy order');
    }
  }

  // Execute a sell order
  async executeSell({ amount, price }) {
    try {
      // In production, this would call your exchange's API
      const order = {
        id: Date.now().toString(),
        type: 'SELL',
        amount,
        price,
        timestamp: new Date().toISOString(),
        status: 'COMPLETED'
      };

      // Store in mock database
      orderHistory.push(order);
      return order;
    } catch (error) {
      throw new Error('Failed to execute sell order');
    }
  }

  // Get order history
  async getOrderHistory() {
    // In production, this would fetch from your database
    return orderHistory;
  }

  // Calculate basic trading metrics
  calculateMetrics(orders) {
    const metrics = {
      totalTrades: orders.length,
      profitableTrades: 0,
      totalProfit: 0,
      winRate: 0
    };

    // In a real application, you would implement proper P&L calculation
    // This is just a placeholder implementation
    orders.forEach(order => {
      if (order.profit > 0) {
        metrics.profitableTrades++;
        metrics.totalProfit += order.profit;
      }
    });

    metrics.winRate = (metrics.profitableTrades / metrics.totalTrades) * 100;
    return metrics;
  }
}

module.exports = new TradeService();
