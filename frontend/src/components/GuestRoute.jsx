import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';

export default function GuestRoute() {
  const token = useSelector(selectCurrentToken);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
