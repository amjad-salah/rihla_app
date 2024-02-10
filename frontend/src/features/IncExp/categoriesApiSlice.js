import { apiSlice } from '../api/apiSlice';

const CATEGORIES_URL = '/api/fin-cats';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => `${CATEGORIES_URL}`,
      providesTags: ['FinCategories'],
    }),
    getCategory: builder.query({
      query: (categoryId) => `${CATEGORIES_URL}/${categoryId}`,
      providesTags: ['FinCategories'],
    }),
    addCategory: builder.mutation({
      query: (category) => ({
        url: `${CATEGORIES_URL}`,
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['FinCategories'],
    }),
    updateCategory: builder.mutation({
      query: (update) => ({
        url: `${CATEGORIES_URL}/${update.id}`,
        method: 'PUT',
        body: update,
      }),
      invalidatesTags: ['FinCategories'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORIES_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FinCategories'],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApiSlice;
