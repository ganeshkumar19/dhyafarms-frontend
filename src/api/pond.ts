// src/api/pond.ts
import axios from 'axios';
import { Pond } from '@/types/models';
import { PondSizes, PondSpeices } from '@/types/ponds';
import { useRegisterAuthStore } from '@/store/registerAuth';

const API_URL = import.meta.env.VITE_API_URL;

interface CreatePondPayload {
  name: string;
  farmId: string;
}

interface UpdatePondPayload {
  name?: string;
  farmId?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * ✅ Get all ponds (optionally filter by farmId)
 */
export const getPonds = async (farmId?: string): Promise<Pond[]> => {
  const url = farmId
    ? `${API_URL}/ponds?farmId=${farmId}`
    : `${API_URL}/ponds`;

  const response = await axios.get<Pond[]>(url, getAuthHeaders());
  return response.data;
};

/**
 * ✅ Get single pond by ID
 */
export const getPondById = async (pondId: string): Promise<Pond> => {
  const response = await axios.get(`${API_URL}/ponds/${pondId}`, getAuthHeaders());
  return response.data;
};

/**
 * ✅ Create a new pond under a specific farm
 */
export const createPond = async (pondData: CreatePondPayload): Promise<Pond> => {
  const token = useRegisterAuthStore.getState().token || localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const response = await axios.post(`${API_URL}/ponds`, pondData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const GetPondSizes = async(): Promise<PondSizes[]>=>{
   const token = useRegisterAuthStore.getState().token || localStorage.getItem('token');
   if(!token){
    throw new Error('No token found in register store');
   }

   try{
    const response = await axios.get(`${API_URL}/ponds/sizes`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
   } catch(error:any){
    console.error('❌ getPondSizes error:', error);
    throw error;
   }
 }

 export const GetPondSpecies = async(): Promise<PondSpeices[]>=>{
  const token = useRegisterAuthStore.getState().token || localStorage.getItem('token');
  if(!token){
   throw new Error('No token found in register store');
  }

  try{
   const response = await axios.get(`${API_URL}/ponds/species`,{
     headers:{
       Authorization: `Bearer ${token}`
     }
   })
   return response.data
  } catch(error:any){
   console.error('❌ getPondSpecies error:', error);
   throw error;
  }
}


export const updatePond = async (
  pondId: string,
  pondData: UpdatePondPayload
): Promise<Pond> => {
  const response = await axios.put(`${API_URL}/ponds/${pondId}`, pondData, getAuthHeaders());
  return response.data;
};

/**
 * ✅ Delete a pond
 */
export const deletePond = async (pondId: string): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/ponds/${pondId}`, getAuthHeaders());
  return response.data;
};

export const getPondsByFarmId = async (farmId: string): Promise<Pond[]> => {
  try {
    const response = await axios.get(`${API_URL}/ponds?farmId=${farmId}`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('❌ getPondsByFarmId error:', error);
    throw error;
  }
};

export const getPondLogs = async (pondId: string, seldate: 'today' | 'last7days') => {
  try {
    const response = await axios.get(
      `${API_URL}/ponds/${pondId}/logs?seldate=${seldate}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('❌ getPondLogs error:', error);
    throw error;
  }
};
