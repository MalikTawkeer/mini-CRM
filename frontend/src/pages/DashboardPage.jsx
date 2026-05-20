import { useEffect } from 'react';
import { toast } from 'sonner';
import { useGetDashboardQuery } from '../features/api/dashboardApi';

const formatDate = (date) =>
  new Date(date).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

function ActivitySkeleton() {
  return (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-slate-700/30 last:border-0">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-700/60 rounded-md w-3/4 max-w-sm" />
        <div className="h-3 bg-slate-700/40 rounded-md w-1/2 max-w-xs" />
      </div>
      <div className="h-3 bg-slate-700/40 rounded-md w-24 shrink-0" />
    </li>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-slate-700 rounded mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl space-y-3"
          >
            <div className="h-4 bg-slate-700/60 rounded w-24" />
            <div className="h-10 bg-slate-700/60 rounded w-16" />
          </div>
        ))}
      </div>

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <div className="h-6 bg-slate-700/60 rounded w-40 mb-6" />
        <ul className="space-y-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <ActivitySkeleton key={i} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useGetDashboardQuery();

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load dashboard');
    }
  }, [isError]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-4">Dashboard</h2>
        <p className="text-slate-400">Unable to load dashboard data.</p>
      </div>
    );
  }

  const { stats, recentActivities } = data;

  const statCards = [
    { label: 'Total Leads', value: stats.totalLeads },
    { label: 'Closed Leads', value: stats.closedLeads },
    { label: 'Pending Leads', value: stats.pendingLeads },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white tracking-tight mb-8">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-sm hover:border-indigo-500/50 transition-all"
          >
            <p className="text-slate-400 font-medium mb-1">{card.label}</p>
            <h3 className="text-4xl font-bold text-white">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Recent Activities</h3>
        {recentActivities?.length === 0 ? (
          <p className="text-slate-500 italic">No activities yet.</p>
        ) : (
          <ul className="space-y-4">
            {recentActivities?.map((activity) => (
              <li
                key={activity._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-slate-700/30 last:border-0"
              >
                <div>
                  <p className="text-white text-sm">{activity.description}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {activity.performedBy?.name} ·{' '}
                    <span className="capitalize">{activity.type.replace(/_/g, ' ')}</span>
                  </p>
                </div>
                <time className="text-xs text-slate-500 shrink-0">
                  {formatDate(activity.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
