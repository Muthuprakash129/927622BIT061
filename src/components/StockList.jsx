import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Box
} from '@mui/material';

const StockList = () => {
  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.04 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 415.32 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.75 },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 485.58 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 175.22 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28 },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 188.15 },
    { symbol: 'V', name: 'Visa Inc.', price: 275.96 },
    { symbol: 'WMT', name: 'Walmart Inc.', price: 59.83 }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Top 10 Stocks
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell align="right">Price ($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell>{stock.symbol}</TableCell>
                <TableCell>{stock.name}</TableCell>
                <TableCell align="right">{stock.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StockList; 