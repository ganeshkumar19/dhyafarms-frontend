import axios from 'axios';
import { NotificationItem } from '@/types/models';
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


export const getFarmNotifications = async (farmId: string): Promise<NotificationItem[]> => {
  try{
    const res = await axios.get(`${API_URL}/notifications/farm?farmId=${farmId}`, getAuthHeaders());
    return res.data;
  }catch(err: any){
    throw err;
  }
 
};

export const getUserNotifications = async (): Promise<NotificationItem[]> => {
  try{
    const res = await axios.get(`${API_URL}/notifications/user`, getAuthHeaders());
    return res.data;
  }catch(err: any){
    throw err;
  }
  
};