import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useGetDashboardQuery, useGetActivitiesQuery } from '../features/api/dashboardApi';
import Pagination from '../components/Pagination';

const ACTIVITY_LIMIT = 10;

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

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-pulse">
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
  );
}

export default function DashboardPage() {
  const [activityPage, setActivityPage] = useState(1);

  const {
    data: dashboard,
    isLoading: statsLoading,
    isError: statsError,
  } = useGetDashboardQuery();

  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    isFetching: activitiesFetching,
    isError: activitiesError,
  } = useGetActivitiesQuery({ page: activityPage, limit: ACTIVITY_LIMIT });

  useEffect(() => {
    if (statsError) toast.error('Failed to load dashboard stats');
  }, [statsError]);

  useEffect(() => {
    if (activitiesError) toast.error('Failed to load activities');
  }, [activitiesError]);

  const stats = dashboard?.stats;
  const activities = activitiesData?.activities ?? [];
  const pagination = activitiesData?.pagination;

  const statCards = stats
    ? [
        { label: 'Total Leads', value: stats.totalLeads },
        { label: 'Closed Leads', value: stats.closedLeads },
        { label: 'Pending Leads', value: stats.pendingLeads },
      ]
    : [];

  const showActivitySkeleton = activitiesLoading && !activitiesData;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white tracking-tight mb-8">Dashboard</h2>

      {statsLoading ? (
        <StatsSkeleton />
      ) : statsError ? (
        <p className="text-slate-400 mb-8">Unable to load stats.</p>
      ) : (
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
      )}

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Recent Activities</h3>

        {showActivitySkeleton ? (
          <ul className="space-y-1 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <ActivitySkeleton key={i} />
            ))}
          </ul>
        ) : activitiesError ? (
          <p className="text-slate-500 italic">Unable to load activities.</p>
        ) : activities.length === 0 ? (
          <p className="text-slate-500 italic">No activities yet.</p>
        ) : (
          <>
            <ul
              className={`space-y-4 transition-opacity ${
                activitiesFetching ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {activities.map((activity) => (
                <li
                  key={activity._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-slate-700/30 last:border-0"
                >
                  <div>
                    <p className="text-white text-sm">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {activity.performedBy?.name} ·{' '}
                      <span className="capitalize">
                        {activity.type.replace(/_/g, ' ')}
                      </span>
                    </p>
                  </div>
                  <time className="text-xs text-slate-500 shrink-0">
                    {formatDate(activity.createdAt)}
                  </time>
                </li>
              ))}
            </ul>

            <Pagination
              page={pagination?.page ?? activityPage}
              totalPages={pagination?.totalPages ?? 1}
              total={pagination?.total ?? 0}
              onPageChange={setActivityPage}
              isLoading={activitiesFetching}
              label="activities"
            />
          </>
        )}
      </div>
    </div>
  );
}
