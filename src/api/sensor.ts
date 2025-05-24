import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getLatestSensorData = async () => {
  try {
    const response = await axios.get(`${API_URL}/sensor-data/latest`);
    return response.data;
  } catch (error) {
    throw error;
  }
};