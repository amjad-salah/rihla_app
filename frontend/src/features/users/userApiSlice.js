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
      query: () => ({
        url: `${USERS_URL}/auth`,
      }),
      providesTags: ['Users'],
    }),
  }),
});

export const { useLoginMutation, useLogoutQuery } = userApiSlice;
