import { apiSlice } from '../api/apiSlice';

const COMPANY_URL = '/api/companies';

export const comapnyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCompanies: builder.query({
      query: () => `${COMPANY_URL}`,
      providesTags: ['Companies'],
    }),
    getComapny: builder.query({
      query: (comapnyId) => `${COMPANY_URL}/${comapnyId}`,
      providesTags: ['Companies'],
    }),
    addComapny: builder.mutation({
      query: (comapny) => ({
        url: `${COMPANY_URL}`,
        method: 'POST',
        body: comapny,
      }),
      invalidatesTags: ['Companies'],
    }),
    updateComapny: builder.mutation({
      query: (update) => ({
        url: `${COMPANY_URL}/${update.id}`,
        method: 'PUT',
        body: update,
      }),
      invalidatesTags: ['Companies'],
    }),
    deleteComapny: builder.mutation({
      query: (id) => ({
        url: `${COMPANY_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Companies'],
    }),
  }),
});

export const {
  useGetAllCompaniesQuery,
  useGetComapnyQuery,
  useAddComapnyMutation,
  useUpdateComapnyMutation,
  useDeleteComapnyMutation,
} = comapnyApiSlice;
