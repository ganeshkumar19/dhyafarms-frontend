import { create } from 'zustand';
import axios from 'axios';
import { User } from '../types/user';
import { Farm } from '../types/models';
import { queryClient } from '../lib/reactQueryClient';
import { useFarmStore } from '@/store/farmsGlobal';
import { useRegisterAuthStore } from '@/store/registerAuth';



interface AuthState {
  token: string | null;
  user: User | null;
  farms: Farm[];
  setToken: (token: string) => void;
  setFarms: (farms: Farm[]) => void;
  login: (data: { user: User; token: string }) => Promise<void>;
  logout: () => void;
}

// Load from localStorage on init
const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');
console.log('storeduser', storedUser)
const initialUser = storedUser ? (JSON.parse(storedUser) as User) : null;

export const useAuthStore = create<AuthState & { setUser: (user: User) => void }>((set) => {
  console.log('🔐 Initial Auth State:', {
    token: storedToken,
    user: initialUser,
  });

  return {
    token: storedToken,
    user: initialUser,
    farms: [],

    
    setUser: (user: User) => {
      localStorage.setItem('user', JSON.stringify(user)); // 💾 persist change
      set({ user }); // 🧠 update Zustand store
    },


    setToken: (token: string) => {
      localStorage.setItem('token', token);
      set({ token });
    },

    setFarms: (farms: Farm[]) => {
      set({ farms });
    },

    login: async ({ token, user }) => {
      console.log('✅ Login success:', { token, user });

      // Persist token & user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Fetch farms
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/farms`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const farms: Farm[] = response.data;
        console.log('🌾 Farms fetched:', farms);

        set({ token, user, farms });
      } catch (err) {
        console.error('❌ Failed to fetch farms', err);
        set({ token, user, farms: [] });
      }
    },

    logout: () => {
      console.log('🚪 Logging out');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      queryClient.clear();
    
      // Clear farms global store
      useFarmStore.getState().setActiveFarmId(null);
      useFarmStore.getState().setActiveFarmName(null);
    
      // ✅ Clear the register auth store too
      useRegisterAuthStore.getState().clearRegisterAuth();
      set({ token: null, user: null, farms: [] });
    },
  };
});