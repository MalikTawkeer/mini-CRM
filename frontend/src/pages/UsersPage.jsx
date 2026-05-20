import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useGetUsersQuery, useCreateUserMutation } from '../features/api/usersApi';
import { getApiErrorMessage } from '../utils/apiError';

const emptyForm = { name: '', email: '', password: '' };

function UserRowSkeleton() {
  return (
    <tr className="border-b border-slate-700/30 animate-pulse">
      <td className="py-4 px-3">
        <div className="h-4 bg-slate-700/60 rounded w-32 mb-2" />
        <div className="h-3 bg-slate-700/40 rounded w-40" />
      </td>
      <td className="py-4 px-3">
        <div className="h-6 bg-slate-700/60 rounded-full w-20" />
      </td>
      <td className="py-4 px-3">
        <div className="h-6 bg-slate-700/60 rounded-full w-14" />
      </td>
      <td className="py-4 px-3">
        <div className="h-3 bg-slate-700/40 rounded w-24" />
      </td>
    </tr>
  );
}

export default function UsersPage() {
  const { data: users = [], isLoading, isError } = useGetUsersQuery();
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isError) toast.error('Failed to load users');
  }, [isError]);

  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const promise = createUser(form).unwrap();

    toast.promise(promise, {
      loading: 'Creating sales agent...',
      success: 'Sales agent created successfully',
      error: (err) => getApiErrorMessage(err, 'Failed to create user'),
    });

    try {
      await promise;
      resetForm();
    } catch {
      /* toast handles error */
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Users</h2>
          <p className="text-slate-500 text-sm mt-1">Manage sales agents on your team</p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          + Add Sales Agent
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">New Sales Agent</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="agent@company.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
              <input
                required
                type="password"
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Min. 6 characters"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl"
              >
                Create Agent
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="text-slate-400 hover:text-white px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 overflow-x-auto">
        {isError ? (
          <p className="text-slate-400">Unable to load users.</p>
        ) : (
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700/50">
                <th className="pb-4 font-semibold px-3">User</th>
                <th className="pb-4 font-semibold px-3">Role</th>
                <th className="pb-4 font-semibold px-3">Status</th>
                <th className="pb-4 font-semibold px-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [1, 2, 3, 4].map((i) => <UserRowSkeleton key={i} />)
                : users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-slate-700/30 hover:bg-slate-700/20"
                    >
                      <td className="py-4 px-3">
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </td>
                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex capitalize px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            user.role === 'admin'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          }`}
                        >
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            user.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-slate-400 text-sm">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
