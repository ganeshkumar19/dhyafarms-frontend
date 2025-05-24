import { create } from 'zustand';

export interface PondFormState {
  pondName: string;
  pondSize: string;
  stockingDensity: string;
  species: string;
  monitoring: 'sensor' | 'manual' | '';
  deviceIds: string[];
}

export interface PondData extends PondFormState {
  apiPondId?: string;
  farmId?: string;
}

interface PondFormStore extends PondFormState {
  pondList: PondData[];
  setField: (field: keyof PondFormState, value: any) => void;
  addDevice: (deviceId: string) => void;
  removeDevice: (deviceId: string) => void;
  addPondToList: (pond: PondData) => void;
  setPondList: (ponds: PondData[]) => void;
  resetForm: () => void;
}

export const usePondFormStore = create<PondFormStore>((set) => ({
  pondName: '',
  pondSize: '',
  stockingDensity: '',
  species: '',
  monitoring: '',
  deviceIds: [],
  pondList: [],

  setField: (field, value) => set((state) => ({ ...state, [field]: value })),

  addDevice: (deviceId) =>
    set((state) =>
      state.deviceIds.includes(deviceId)
        ? state
        : { deviceIds: [...state.deviceIds, deviceId] }
    ),

  removeDevice: (deviceId) =>
    set((state) => ({
      deviceIds: state.deviceIds.filter((id) => id !== deviceId),
    })),

  addPondToList: (pond) =>
    set((state) => {
      const updated = [...state.pondList, pond];
      return { pondList: updated };
    }),

  setPondList: (ponds) =>
    set(() => {
      return { pondList: ponds };
    }),

  resetForm: () =>
    set({
      pondName: '',
      pondSize: '',
      stockingDensity: '',
      species: '',
      monitoring: '',
      deviceIds: [],
    }),
}));
