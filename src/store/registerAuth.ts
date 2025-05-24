import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  // add other user fields if needed
}

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

interface AuthState {
  token: string | null;
  user: User | null;
  formData: FormData | null;
  setRegisterAuth: (token: string, user: User, formData: FormData) => void;
  clearRegisterAuth: () => void;
}

export const useRegisterAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  formData: null,
  setRegisterAuth: (token, user, formData) => set({ token, user, formData }),
  clearRegisterAuth: () => set({ token: null, user: null, formData: null }),
}));
