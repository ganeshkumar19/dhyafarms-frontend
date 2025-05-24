import { useRegisterAuthStore } from '@/store/registerAuth';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = useRegisterAuthStore.getState().token || localStorage.getItem('token');
  
    if (!token) {
      console.warn('🚫 No auth token found in localStorage');
      return {}; // Return empty headers instead of Bearer null
    }
  
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

// Generalized function to update any subset of user settings
export const updateUserSettings = async (
  settings: Partial<{ language: string; theme: string; emailNotify: boolean; name: string;}>
) => {

    const headers = getAuthHeaders();
    if (!headers || !headers.headers?.Authorization) return;
  
    try {
      await axios.patch(`${API_URL}/user/settings`, settings, headers);
      console.log(`✅ User settings updated:`, settings);
  
      // 🔧 Patch localStorage user.theme
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        const updatedUser = { ...user, ...settings };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('📝 Updated user in localStorage:', updatedUser);
      }
    } catch (err) {
      console.error('❌ Failed to update user settings:', err);
    }
  };
  