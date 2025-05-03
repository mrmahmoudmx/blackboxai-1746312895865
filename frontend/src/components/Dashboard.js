import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import TradingViewChart from './TradingViewChart';
import TradeExecution from './TradeExecution';
import OrderHistorySidebar from './OrderHistorySidebar';

const Dashboard = () => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentPrice = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/trade/price', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCurrentPrice(response.data.price);
      setError(null);
    } catch (err) {
      setError('Failed to fetch current price');
      console.error('Error fetching price:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentPrice();
    // Update price every 5 seconds
    const interval = setInterval(fetchCurrentPrice, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 64px)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Main Trading View Chart */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <TradingViewChart />
          </Paper>
        </Grid>

        {/* Trade Execution and Order History */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Trade Execution Panel */}
            <Grid item xs={12}>
              <TradeExecution currentPrice={currentPrice} />
            </Grid>

            {/* Order History */}
            <Grid item xs={12}>
              <OrderHistorySidebar />
            </Grid>
          </Grid>
        </Grid>

        {/* Error Display */}
        {error && (
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: 'error.dark',
                color: 'error.contrastText',
                borderRadius: 2,
              }}
            >
              <Typography>{error}</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
