import axios from 'axios';
import { Farm } from '@/types/models';
import { useRegisterAuthStore } from '@/store/registerAuth';
import { CreateFarm, FarmOverview, FarmSize, FarmType, FarmWaterSource, NewFarm } from '@/types/farms';

const API_URL = import.meta.env.VITE_API_URL;

// 🔐 Helper to get auth headers from localStorage
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
/**
 * ✅ Get all farms for current logged-in user
 */
export const getFarms = async (): Promise<Farm[]> => {
  try {
    const response = await axios.get(`${API_URL}/farms`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('❌ getFarms error:', error);
    throw error;
  }
};

/**
 * ✅ Create a new farm for current user
 */
export const createFarm = async (farmData: CreateFarm): Promise<NewFarm> => {
  try {
    const response = await axios.post(`${API_URL}/farms`, farmData, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('❌ createFarm error:', error);
    throw error;
  }
};

export const getFarmTypes = async (): Promise<FarmType[]> => {
  try {
    const token = useRegisterAuthStore.getState().token || localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found in register store');
    }

    const response = await axios.get(`${API_URL}/farms/types`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ getFarmTypes error:', error);
    throw error;
  }
};

export const getFarmSizes= async (): Promise<FarmSize[]> => {
 try{
  const token = useRegisterAuthStore.getState().token || localStorage.getItem('token');
  if(!token){
    throw new Error('No token found in register store');
  }
  const response = await axios.get((`${API_URL}/farms/sizes`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;

  } catch (error: any) {
    console.error('❌ getFarmTypes error:', error);
    throw error;
  }
}

export const getFarmWaterSources = async(): Promise<FarmWaterSource[]>=>{
 try{
  const token = useRegisterAuthStore.getState().token || localStorage.getItem('token');
  if(!token){
    throw new Error('No token found in register store');
  }

  const response= await axios.get(`${API_URL}/farms/watersrcs`, {
    headers:{
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
 }  catch (error: any) {
  console.error('❌ getFarmTypes error:', error);
  throw error;
}
}

export const getFarmOverview = async (farmId: string): Promise<FarmOverview> => {
  try {
    const response = await axios.get(`${API_URL}/farms/${farmId}/overview`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('❌ getFarmOverview error:', error);
    throw error;
  }
};
