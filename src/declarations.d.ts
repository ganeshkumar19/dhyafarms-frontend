// src/declarations.d.ts

// 👇 Fix Swiper imports error for TypeScript
declare module 'swiper/css';
declare module 'swiper/css/pagination';

// 👇 Extend Window interface for sendOtp, verifyOtp
export {};

declare global {
  interface Window {
    sendOtp: (
      identifier: string,
      success?: (data: any) => void,
      failure?: (error: any) => void
    ) => void;

    verifyOtp: (
      otp: string,
      success?: (data: any) => void,
      failure?: (error: any) => void
    ) => void;
  }
}