import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  ExitToApp as ExitToAppIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null; // Don't show navbar on login page
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#132f4c' }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
        >
          <ShowChartIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          BTC/USDT Scalping
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<AccountBalanceIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>

          <Button
            color="inherit"
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
