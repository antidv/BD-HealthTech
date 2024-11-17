import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoutePaciente = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Navigate to={"/"} replace />
  return (
    <Outlet />
  )
};
