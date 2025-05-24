// store/farmStore.ts
import { NewFarm } from '@/types/farms';
import { create } from 'zustand';

interface FarmState {
  farm: NewFarm | null;
  setNewFarm: (farm: NewFarm) => void;
  clearNewFarm: () => void;
}

export const useNewFarmStore = create<FarmState>((set) => ({
  farm: null,
  setNewFarm: (farm) => set({ farm }),
  clearNewFarm: () => set({ farm: null }),
}));
