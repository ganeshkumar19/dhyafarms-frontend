import { create } from 'zustand';

// Define discriminated union for manual entries
export type ManualDataEntry =
  | {
      type: 'Water' | '';
      farmId: string;
      farmName: string;
      pondId: string;
      pondName: string;
      do?: string;
      temp?: string;
      ph?: string;
      ammonia?: string;
      nitrite?: string;
      nitrate?: string;
      salinity?: string;
      turbidity?: string;
      tds?: string;
      orp?: string;
      chlorine?: string;
      water_level?: string;
    }
  | {
      type: 'Fish' | '';
      farmId: string;
      farmName: string;
      pondId: string;
      pondName: string;
      species: string;
      avg_weight: string;
      feed_today?: number;
      days_in_cycle?: number;
      total_stock?: number;
    };

interface ManualEntryStore {
  entries: ManualDataEntry[];
  addEntry: (entry: ManualDataEntry) => void;
  setEntries: (entries: ManualDataEntry[]) => void;
  resetEntries: () => void;
}


export const useManualEntryStore = create<ManualEntryStore>((set) => ({
  entries: [],

  addEntry: (entry) =>
    set((state) => {
      const updated = [...state.entries, entry];
      return { entries: updated };
    }),

  setEntries: (entries) => {
    set({ entries });
  },

  resetEntries: () => {
    set({ entries: [] });
  },
}));

