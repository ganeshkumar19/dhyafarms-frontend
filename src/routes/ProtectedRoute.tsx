import { Navigate, useLocation } from 'react-router-dom';
import { JSX, useEffect, useState } from 'react';
import { useRegisterAuthStore } from '@/store/registerAuth';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useRegisterAuthStore.getState().token || localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) return null; // or return a Spinner

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}