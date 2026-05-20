import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';

export default function RootRedirect() {
  const token = useSelector(selectCurrentToken);
  return <Navigate to={token ? '/dashboard' : '/'} replace />;
}
