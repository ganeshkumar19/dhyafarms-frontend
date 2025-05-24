import { useRegisterAuthStore } from '@/store/registerAuth';
import axios from 'axios';
 // update path if needed

export const postManualSensorData = async (data: any) => {
  try {
    // ✅ Try Zustand first, then localStorage as fallback
    let token = useRegisterAuthStore.getState().token;
    if (!token) {
      token = localStorage.getItem('token');
    }

    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/sensor-data/manual`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Manual sensor data posted successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error posting manual sensor data:', error.response?.data || error.message || error);
    throw error;
  }
};