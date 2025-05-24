import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography,
  Paper,
  Button
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getStockPrice } from '../services/api';

const StockPage = () => {
  const initialStocks = {
    'Apple Inc.': 'AAPL',
    'Microsoft Corporation': 'MSFT',
    'Alphabet Inc.': 'GOOGL',
    'Amazon.com Inc.': 'AMZN',
    'Meta Platforms Inc.': 'META',
    'Tesla Inc.': 'TSLA',
    'NVIDIA Corporation': 'NVDA',
    'JPMorgan Chase & Co.': 'JPM',
    'Visa Inc.': 'V',
    'Walmart Inc.': 'WMT'
  };

  const [stocks] = useState(initialStocks);
  const [selectedStock, setSelectedStock] = useState('AAPL'); // Set default to AAPL
  const [timeInterval, setTimeInterval] = useState(30);
  const [priceData, setPriceData] = useState([]);
  const [average, setAverage] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchStockPrice = async () => {
      if (selectedStock) {
        try {
          const data = await getStockPrice(selectedStock, timeInterval);
          const formattedData = Array.isArray(data) ? data : [data];
          setPriceData(formattedData.map(item => ({
            time: new Date(item.lastUpdatedAt).toLocaleTimeString(),
            price: item.price
          })));
          
          // Calculate average
          const sum = formattedData.reduce((acc, item) => acc + item.price, 0);
          setAverage(sum / formattedData.length);
        } catch (error) {
          console.error('Error fetching stock price:', error);
        }
      }
    };
    fetchStockPrice();
  }, [selectedStock, timeInterval]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Stock Price Analysis
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Stock</InputLabel>
            <Select
              value={selectedStock}
              label="Select Stock"
              onChange={(e) => { setSelectedStock(e.target.value); setShowResult(false); }}
            >
              {Object.entries(stocks).map(([name, ticker]) => (
                <MenuItem key={ticker} value={ticker}>
                  {name} ({ticker})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Time Interval</InputLabel>
            <Select
              value={timeInterval}
              label="Time Interval"
              onChange={(e) => { setTimeInterval(e.target.value); setShowResult(false); }}
            >
              <MenuItem value={15}>Last 15 minutes</MenuItem>
              <MenuItem value={30}>Last 30 minutes</MenuItem>
              <MenuItem value={60}>Last 60 minutes</MenuItem>
              <MenuItem value={120}>Last 2 hours</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" onClick={() => setShowResult(true)}>
            Show Result
          </Button>
        </Box>

        {/* Display latest price as a number only after button click */}
        {showResult && priceData.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" color="primary">
              Latest Price: ${priceData[priceData.length - 1].price.toFixed(2)}
            </Typography>
          </Box>
        )}

        {/* Display the graph only after button click */}
        {showResult && (
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  name="Price"
                />
                <Line 
                  type="monotone" 
                  dataKey={() => average} 
                  stroke="#82ca9d" 
                  name="Average"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default StockPage; 