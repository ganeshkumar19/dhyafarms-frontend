import { create } from 'zustand';
import { Farm } from '../types/models';
import { getFarms } from '../api/farm';

interface FarmStore {
  farms: Farm[];
  setFarms: (farms: Farm[]) => void;
  fetchFarms: () => Promise<void>;
}

export const useFarmStore = create<FarmStore>((set) => ({
  farms: [],

  setFarms: (farms) => {
    console.log('🌾 Setting farms in store:', farms);
    set({ farms });
  },

  fetchFarms: async () => {
    console.log('📡 Fetching farms from API...');
    const farms = await getFarms();
    console.log('✅ API returned farms:', farms);
    set({ farms });
  },
}));