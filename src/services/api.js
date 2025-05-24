import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/evaluation-service';

export const getStocks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/stocks`);
        return response.data.stocks;
    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw error;
    }
};

export const getStockPrice = async (ticker, minutes = null) => {
    try {
        const url = minutes
            ? `${BASE_URL}/stocks/${ticker}?minutes=${minutes}`
            : `${BASE_URL}/stocks/${ticker}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching price for ${ticker}:`, error);
        throw error;
    }
}; 