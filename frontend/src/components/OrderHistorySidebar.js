import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const OrderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  height: '100%',
  overflowY: 'auto',
}));

const OrderHistorySidebar = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/trade/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch order history:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Fetch orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const getOrderColor = (type) => {
    return type === 'BUY' ? 'success' : 'error';
  };

  return (
    <OrderPaper elevation={3}>
      <Typography variant="h6" gutterBottom>
        Order History
      </Typography>
      
      <List sx={{ mt: 2 }}>
        {orders.length === 0 ? (
          <Typography color="text.secondary" align="center">
            No orders yet
          </Typography>
        ) : (
          orders.map((order) => (
            <React.Fragment key={order.id}>
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  py: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    mb: 1,
                  }}
                >
                  <Chip
                    label={order.type}
                    color={getOrderColor(order.type)}
                    size="small"
                    sx={{ minWidth: 80 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>

                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" gutterBottom>
                    Amount: {order.amount} BTC
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${order.price.toFixed(2)}
                  </Typography>
                </Box>

                {order.status && (
                  <Chip
                    label={order.status}
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: 
                        order.status === 'COMPLETED' 
                          ? 'rgba(46, 125, 50, 0.2)' 
                          : 'rgba(211, 47, 47, 0.2)',
                      color: 
                        order.status === 'COMPLETED' 
                          ? 'success.main' 
                          : 'error.main',
                    }}
                  />
                )}
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        )}
      </List>
    </OrderPaper>
  );
};

export default OrderHistorySidebar;
