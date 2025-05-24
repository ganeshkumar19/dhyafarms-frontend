import { create } from 'zustand';
import { Pond } from '../types/models';
import { getPonds } from '../api/pond';

interface PondStore {
  ponds: Pond[];
  setPonds: (ponds: Pond[]) => void;
  fetchPonds: () => Promise<void>;
}

export const usePondStore = create<PondStore>((set) => ({
  ponds: [],

  setPonds: (ponds) => {
    console.log('💧 Setting ponds in store:', ponds);
    set({ ponds });
  },

  fetchPonds: async () => {
    console.log('📡 Fetching ponds from API...');
    const ponds = await getPonds();
    console.log('✅ API returned ponds:', ponds);
    set({ ponds });
  },
}));