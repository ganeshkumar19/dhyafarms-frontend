export interface User {
    id: string;
    email: string;
    name: string; // ✅ Add this line
    tenantId: string;
    theme: string;
    language: string;
    phone: string;
    password: string;
    location: string;
    avatarUrl?: string; 
    lat: string;
    long: string;
    emailNotify: boolean;
  }