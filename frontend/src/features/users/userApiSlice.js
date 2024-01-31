import { apiSlice } from '../api/apiSlice';

const USERS_URL = '/api/users';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
    logout: builder.query({
      query: () => `${USERS_URL}/auth`,
    }),
    getAllUsers: builder.query({
      query: () => `${USERS_URL}`,
    }),
  }),
});

export const { useLoginMutation, useLazyLogoutQuery, useGetAllUsersQuery } =
  userApiSlice;
