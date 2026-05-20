import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '../features/api/authApi';
import { logout, selectCurrentToken } from '../features/auth/authSlice';
import { apiSlice } from '../features/api/apiSlice';

/**
 * Validates a stored token before rendering routes.
 * Prevents stale sessions from skipping the login page.
 */
export default function AuthGate({ children }) {
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();
  const [ready, setReady] = useState(!token);

  const { isError, isLoading, isSuccess } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (!token) {
      setReady(true);
      return;
    }

    if (isLoading) return;

    if (isError) {
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
    }

    setReady(true);
  }, [token, isLoading, isError, isSuccess, dispatch]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return children;
}
