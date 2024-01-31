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
    }),
    logout: builder.query({
      query: () => `${USERS_URL}/auth`,
    }),
    getAllUsers: builder.query({
      query: () => `${USERS_URL}`,
      providesTags: ['Users'],
    }),
    getUser: builder.query({
      query: (userId) => `${USERS_URL}/${userId}`,
      providesTags: ['Users'],
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: (update) => ({
        url: `${USERS_URL}/${update.id}`,
        method: 'PUT',
        body: update,
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyLogoutQuery,
  useGetAllUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
