import { create } from 'zustand';

interface StepTwoFormData {
  farmName: string;
  farmSize: string;
  farmType: string;
  waterSource: string;
  notes: string;
  devices: string[];
  newDevice: string;
}

interface StepTwoFormStore extends StepTwoFormData {
  setForm: (data: Partial<StepTwoFormData>) => void;
  resetForm: () => void;
}

const initialFormState: StepTwoFormData = {
  farmName: '',
  farmSize: '',
  farmType: '',
  waterSource: '',
  notes: '',
  devices: [],
  newDevice: '',
};

export const useStepTwoFormStore = create<StepTwoFormStore>((set) => ({
  ...initialFormState,
  setForm: (data) => set((state) => ({ ... state, ...data })),
  resetForm: () => set(initialFormState),
}));
