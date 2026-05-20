import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { logout, selectCurrentUser, selectIsAdmin } from '../features/auth/authSlice';
import { useLogoutMutation } from '../features/api/authApi';
import { apiSlice } from '../features/api/apiSlice';

const baseNavItems = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/leads', label: 'Leads' },
];

const adminNavItems = [{ to: '/users', label: 'Users' }];

export default function Layout() {
  const user = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);
  const navItems = isAdmin ? [...baseNavItems, ...adminNavItems] : baseNavItems;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      /* token cleared locally regardless */
    }
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState());
    toast.success('Logged out successfully');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex">
      <aside className="w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col shadow-2xl z-10 hidden md:flex">
        <div className="flex items-center gap-3 mb-10 text-white">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xl">
            M
          </div>
          <h1 className="text-xl font-bold tracking-wide">MiniCRM</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-6 border-t border-slate-800">
          <p className="text-sm text-white font-medium truncate">{user?.name}</p>
          <p className="text-xs text-slate-500 capitalize">
            {user?.role?.replace('_', ' ')}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 w-full text-sm text-slate-400 hover:text-red-400 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6 md:px-8">
          <div className="md:hidden flex items-center gap-2 text-white font-bold">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-sm">
              M
            </span>
            MiniCRM
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-slate-400 hidden sm:inline">{user?.email}</span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-slate-700" />
          </div>
        </header>
        <main className="p-6 md:p-8 overflow-y-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
