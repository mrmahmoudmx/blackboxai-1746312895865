import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
  fontSize: '1.1rem',
  fontWeight: 'bold',
}));

const TradeExecution = ({ currentPrice }) => {
  const [amount, setAmount] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleTrade = async (type) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/trade/${type.toLowerCase()}`,
        {
          amount: parseFloat(amount),
          price: currentPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setNotification({
        open: true,
        message: `${type} order executed successfully!`,
        severity: 'success',
      });
      setAmount('');
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.error || `Failed to execute ${type} order`,
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Paper 
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Trade Execution
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Current BTC/USDT Price
        </Typography>
        <Typography variant="h4" color="primary">
          ${currentPrice?.toFixed(2) || '---'}
        </Typography>
      </Box>

      <TextField
        fullWidth
        label="Amount (BTC)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          inputProps: { 
            min: 0,
            step: 0.001
          }
        }}
      />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <ActionButton
            variant="contained"
            color="success"
            onClick={() => handleTrade('BUY')}
            disabled={!amount || amount <= 0}
          >
            BUY
          </ActionButton>
        </Grid>
        <Grid item xs={6}>
          <ActionButton
            variant="contained"
            color="error"
            onClick={() => handleTrade('SELL')}
            disabled={!amount || amount <= 0}
          >
            SELL
          </ActionButton>
        </Grid>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TradeExecution;
