import { apiSlice } from '../api/apiSlice';

const TRANSACTIONS_URL = '/api/transactions';

export const transactionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query({
      query: () => `${TRANSACTIONS_URL}`,
      providesTags: ['Transactions'],
    }),
    getTransaction: builder.query({
      query: (transactionId) => `${TRANSACTIONS_URL}/${transactionId}`,
      providesTags: ['Transactions'],
    }),
    addTransaction: builder.mutation({
      query: (transaction) => ({
        url: `${TRANSACTIONS_URL}`,
        method: 'POST',
        body: transaction,
      }),
      invalidatesTags: ['Transactions'],
    }),
    updateTransaction: builder.mutation({
      query: (update) => ({
        url: `${TRANSACTIONS_URL}/${update.id}`,
        method: 'PUT',
        body: update,
      }),
      invalidatesTags: ['Transactions'],
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `${TRANSACTIONS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transactions'],
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useGetTransactionQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApiSlice;
