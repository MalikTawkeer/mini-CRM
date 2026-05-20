import { apiSlice } from './apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => '/dashboard',
      providesTags: ['Dashboard'],
    }),
    getActivities: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/dashboard/activities?page=${page}&limit=${limit}`,
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardQuery, useGetActivitiesQuery } = dashboardApi;
