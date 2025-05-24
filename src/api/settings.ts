import axios from 'axios';
import { useRegisterAuthStore } from '@/store/registerAuth';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = useRegisterAuthStore.getState().token || localStorage.getItem('token');
  if (!token) {
    console.warn('🚫 No auth token found in localStorage');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const changeUserPassword = async (oldPassword: string, newPassword: string) => {
  const response = await axios.put(
    `${API_URL}/user/change-password`,
    { oldPassword, newPassword },
    getAuthHeaders()
  );
  return response.data;
};

export const changeUserPhone = async (newPhone: string) => {
    const response = await axios.put(
      `${API_URL}/user/change-phone`,
      { newPhone },
      getAuthHeaders()
    );
    return response.data;
  };
