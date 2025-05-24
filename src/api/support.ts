import { useRegisterAuthStore } from '@/store/registerAuth';
import axios from 'axios';

interface SupportTicketData {
  issue: string;
  farmId: string;
  pondId: string;
  deviceId?: string;
  screenshotUrl?: string;
  severity?: string;
}
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



export const createSupportTicket = async (ticketData: SupportTicketData) => {
  try {
    const response = await axios.post(
      `${API_URL}/support-tickets`,
      ticketData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
};

export const getSupportTickets = async () => {
  try {
    const response = await axios.get(`${API_URL}/support-tickets`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    throw error;
  }
};
