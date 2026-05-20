import { apiSlice } from './apiSlice';

export const leadsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query({
      query: () => '/leads',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Lead', id: _id })),
              { type: 'Lead', id: 'LIST' },
            ]
          : [{ type: 'Lead', id: 'LIST' }],
    }),
    getLead: builder.query({
      query: (id) => `/leads/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Lead', id }],
    }),
    createLead: builder.mutation({
      query: (body) => ({
        url: '/leads',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Lead', id: 'LIST' }, 'Dashboard'],
    }),
    updateLead: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/leads/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Lead', id },
        { type: 'Lead', id: 'LIST' },
        'Dashboard',
      ],
    }),
    deleteLead: builder.mutation({
      query: (id) => ({
        url: `/leads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Lead', id: 'LIST' }, 'Dashboard'],
    }),
    assignLead: builder.mutation({
      query: ({ id, assignedTo }) => ({
        url: `/leads/${id}/assign`,
        method: 'PATCH',
        body: { assignedTo },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Lead', id },
        { type: 'Lead', id: 'LIST' },
        'Dashboard',
      ],
    }),
    updateLeadStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/leads/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Lead', id },
        { type: 'Lead', id: 'LIST' },
        'Dashboard',
      ],
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useGetLeadQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useAssignLeadMutation,
  useUpdateLeadStatusMutation,
} = leadsApi;
