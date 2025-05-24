import React, { useState, useEffect } from 'react';
import { Box, Container, FormControl, InputLabel, Select, MenuItem, Typography, Paper } from '@mui/material';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { getStocks, getStockPrice } from '../services/api';

const CorrelationHeatmap = () => {
  const [stocks, setStocks] = useState({});
  const [timeInterval, setTimeInterval] = useState(30);
  const [correlationData, setCorrelationData] = useState([]);
  const [stockStats, setStockStats] = useState({});

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const stocksData = await getStocks();
        setStocks(stocksData);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };
    fetchStocks();
  }, []);

  const calculateCorrelation = (prices1, prices2) => {
    if (prices1.length !== prices2.length) return 0;

    const n = prices1.length;
    const mean1 = prices1.reduce((a, b) => a + b, 0) / n;
    const mean2 = prices2.reduce((a, b) => a + b, 0) / n;

    const covariance = prices1.reduce((acc, price1, i) => {
      return acc + (price1 - mean1) * (prices2[i] - mean2);
    }, 0) / n;

    const stdDev1 = Math.sqrt(prices1.reduce((acc, price) => acc + Math.pow(price - mean1, 2), 0) / n);
    const stdDev2 = Math.sqrt(prices2.reduce((acc, price) => acc + Math.pow(price - mean2, 2), 0) / n);

    return covariance / (stdDev1 * stdDev2);
  };

  const calculateStats = (prices) => {
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length;
    return {
      mean,
      stdDev: Math.sqrt(variance)
    };
  };

  useEffect(() => {
    const fetchAndCalculateCorrelations = async () => {
      if (Object.keys(stocks).length === 0) return;

      const stockTickers = Object.values(stocks);
      const priceData = {};
      const stats = {};

      // Fetch price data for all stocks
      for (const ticker of stockTickers) {
        try {
          const data = await getStockPrice(ticker, timeInterval);
          const prices = Array.isArray(data) ? data.map(d => d.price) : [data.price];
          priceData[ticker] = prices;
          stats[ticker] = calculateStats(prices);
        } catch (error) {
          console.error(`Error fetching data for ${ticker}:`, error);
        }
      }

      setStockStats(stats);

      // Calculate correlations
      const correlationMatrix = stockTickers.map(ticker1 => {
        const row = {
          ticker: ticker1,
        };
        stockTickers.forEach(ticker2 => {
          row[ticker2] = calculateCorrelation(priceData[ticker1], priceData[ticker2]);
        });
        return row;
      });

      setCorrelationData(correlationMatrix);
    };

    fetchAndCalculateCorrelations();
  }, [stocks, timeInterval]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Stock Correlation Heatmap
        </Typography>

        <FormControl sx={{ minWidth: 200, mb: 3 }}>
          <InputLabel>Time Interval</InputLabel>
          <Select
            value={timeInterval}
            label="Time Interval"
            onChange={(e) => setTimeInterval(e.target.value)}
          >
            <MenuItem value={15}>Last 15 minutes</MenuItem>
            <MenuItem value={30}>Last 30 minutes</MenuItem>
            <MenuItem value={60}>Last 60 minutes</MenuItem>
            <MenuItem value={120}>Last 2 hours</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ height: 600 }}>
          <ResponsiveHeatMap
            data={correlationData}
            keys={Object.values(stocks)}
            indexBy="ticker"
            margin={{ top: 100, right: 60, bottom: 60, left: 60 }}
            forceSquare={true}
            axisTop={null}
            axisRight={null}
            colors={{
              type: 'sequential',
              scheme: 'red_yellow_blue'
            }}
            labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
            animate={true}
            hoverTarget="cell"
            tooltip={({ xKey, yKey, value }) => (
              <div style={{ background: 'white', padding: '10px', border: '1px solid #ccc' }}>
                <strong>{xKey} vs {yKey}</strong>
                <br />
                Correlation: {value.toFixed(3)}
                <br />
                {xKey} Stats:
                <br />
                Mean: {stockStats[xKey]?.mean.toFixed(2)}
                <br />
                Std Dev: {stockStats[xKey]?.stdDev.toFixed(2)}
              </div>
            )}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default CorrelationHeatmap; 