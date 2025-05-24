import axios from 'axios';

// Read API URL from environment
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error('VITE_API_URL is not defined'); // early error if URL missing
}

// 👉 Normal Password Login
export const loginWithPassword = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,  // password will be used
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// 👉 OTP Login (after frontend verification, no password needed)
export const loginWithOtp = async (username: string, otpMessage: string) => {
  console.log('username', username);
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: `+91${username}`, // 👈 Default +91 used here
      otp: otpMessage,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// 👉 Register API
interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  language: string;
  location: string;
  lat: string;
  long: string;
}

export const register = async (payload: RegisterPayload) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};