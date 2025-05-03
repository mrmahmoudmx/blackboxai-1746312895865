import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

let tvScriptLoadingPromise;

const TradingViewChart = () => {
  const onLoadScriptRef = useRef();

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
        height: 'calc(100vh - 200px)',
        minHeight: '500px',
        width: '100%',
        backgroundColor: '#131722',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    />
  );
};

export default TradingViewChart;
