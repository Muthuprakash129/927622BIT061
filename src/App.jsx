import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Tab, 
  Tabs 
} from '@mui/material';
import StockPage from './components/StockPage';
import CorrelationHeatmap from './components/CorrelationHeatmap';
import StockList from './components/StockList';

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stock Price Analysis
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Stock List" />
            <Tab label="Stock Price Chart" />
            <Tab label="Correlation Heatmap" />
          </Tabs>
        </Box>

        <Box sx={{ mt: 3 }}>
          {currentTab === 0 && <StockList />}
          {currentTab === 1 && <StockPage />}
          {currentTab === 2 && <CorrelationHeatmap />}
        </Box>
      </Container>
    </Box>
  );
}

export default App;
