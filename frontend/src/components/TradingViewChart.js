import React, { useEffect, useRef, useState } from 'react';
import { Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

let tvScriptLoadingPromise;

const SignalMarker = styled('div')(({ theme, type }) => ({
  position: 'absolute',
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: type === 'buy' ? '#4caf50' : '#f44336',
  border: '2px solid white',
  cursor: 'default',
  pointerEvents: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  fontSize: 14,
  userSelect: 'none',
}));

const TradingViewChart = () => {
  const onLoadScriptRef = useRef();
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

    // Simulate buy and sell signals
    const demoSignals = [
      { id: 1, leftPercent: 20, topPercent: 40, type: 'buy', price: 95000, time: '1h ago' },
      { id: 2, leftPercent: 50, topPercent: 60, type: 'sell', price: 97000, time: '30m ago' },
      { id: 3, leftPercent: 75, topPercent: 30, type: 'buy', price: 96000, time: '15m ago' },
    ];
    setSignals(demoSignals);

    return () => {
      onLoadScriptRef.current = null;
    };
  }, []);

  function createWidget() {
    if (document.getElementById('tradingview-widget') && 'TradingView' in window) {
      new window.TradingView.widget({
        autosize: true,
        symbol: 'BINANCE:BTCUSDT',
        interval: '1',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: false,
        container_id: 'tradingview-widget',
        studies: [
          'RSI@tv-basicstudies',
          'MACD@tv-basicstudies',
          'Volume@tv-basicstudies'
        ],
        hide_side_toolbar: false,
        details: true,
        hotlist: true,
        calendar: true,
        show_popup_button: true,
        popup_width: '1000',
        popup_height: '650',
      });
    }
  }

  return (
    <Box
      id="tradingview-widget"
      sx={{
        position: 'relative',
        height: 'calc(100vh - 200px)',
        minHeight: '500px',
        width: '100%',
        backgroundColor: '#131722',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      {/* TradingView widget container */}
      <Box id="tradingview-widget-container" sx={{ height: '100%', width: '100%' }} />

      {/* Signals overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {signals.map((signal) => (
          <Tooltip
            key={signal.id}
            title={`${signal.type.toUpperCase()} at $${signal.price} (${signal.time})`}
            placement="top"
            arrow
          >
            <SignalMarker
              type={signal.type}
              sx={{
                top: `${signal.topPercent}%`,
                left: `${signal.leftPercent}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto',
              }}
            >
              {signal.type === 'buy' ? 'B' : 'S'}
            </SignalMarker>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default TradingViewChart;
