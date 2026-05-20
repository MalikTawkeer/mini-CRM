import { apiSlice } from './apiSlice';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query({
      query: () => '/users/team',
      providesTags: ['User'],
    }),
    getUsers: builder.query({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'User', id: _id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, 'User'],
    }),
  }),
});

export const {
  useGetTeamMembersQuery,
  useGetUsersQuery,
  useCreateUserMutation,
} = usersApi;
