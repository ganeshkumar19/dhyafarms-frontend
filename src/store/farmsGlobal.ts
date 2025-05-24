import { create } from 'zustand';
import { Farm } from '@/types/models';

interface FarmStoreState {
  farms: Farm[];
  setFarms: (farms: Farm[]) => void;
  activeFarmId: string | null;
  setActiveFarmId: (id: string | null) => void; // updated here
  activeFarmName: string | null;
  setActiveFarmName: (name: string | null) => void; // updated here
}

export const useFarmStore = create<FarmStoreState>((set) => ({
  farms: [],
  setFarms: (farms) => set({ farms }),
  activeFarmId: null,
  setActiveFarmId: (id) => set({ activeFarmId: id }),
  activeFarmName: null,
  setActiveFarmName: (name) => set({ activeFarmName: name }),
}));