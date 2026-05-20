import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken, selectIsAdmin } from '../features/auth/authSlice';

export default function AdminRoute() {
  const token = useSelector(selectCurrentToken);
  const isAdmin = useSelector(selectIsAdmin);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
