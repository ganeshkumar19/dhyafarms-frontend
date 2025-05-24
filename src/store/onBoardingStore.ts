import { create } from 'zustand';

interface FormData {
  fullName: string;
  countryCode: string;
  mobile: string;
  email: string;
  password: string;
  language: string;
  location: string;
  lat: string;
  long: string;
}

interface OnboardingStore {
  form: FormData;
  setForm: (values: Partial<FormData>) => void;
  resetForm: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  form: {
    fullName: '',
    countryCode: '+91',
    mobile: '',
    email: '',
    password: '',
    language: 'english',
    location: '',
    lat: '',
    long: '',
  },
  setForm: (values) =>
    set((state) => ({
      form: { ...state.form, ...values },
    })),
  resetForm: () =>
    set({
      form: {
        fullName: '',
        countryCode: '+91',
        mobile: '',
        email: '',
        password: '',
        language: 'english',
        location: '',
        lat: '',
        long: '',
      },
    }),
}));
