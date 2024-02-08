import { apiSlice } from '../api/apiSlice';

const JOURNEYS_URL = '/api/journeys';

export const journeysApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllJourneys: builder.query({
      query: () => `${JOURNEYS_URL}`,
      providesTags: ['Journeys'],
    }),
    getJourney: builder.query({
      query: (journeyNo) => `${JOURNEYS_URL}/${journeyNo}`,
      providesTags: ['Journeys'],
    }),
    addJourney: builder.mutation({
      query: (journey) => ({
        url: `${JOURNEYS_URL}`,
        method: 'POST',
        body: journey,
      }),
      invalidatesTags: ['Journeys'],
    }),
    updateJourney: builder.mutation({
      query: (update) => ({
        url: `${JOURNEYS_URL}/${update.journeyNo}`,
        method: 'PUT',
        body: update,
      }),
      invalidatesTags: ['Journeys'],
    }),
    deleteJourney: builder.mutation({
      query: (journeyNo) => ({
        url: `${JOURNEYS_URL}/${journeyNo}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Journeys'],
    }),
    getAllReservations: builder.query({
      query: (journeyNo) => `${JOURNEYS_URL}/${journeyNo}/reservations`,
      providesTags: ['Reservations'],
    }),
    getReservation: builder.query({
      query: (data) =>
        `${JOURNEYS_URL}/${data.journeyNo}/reservations/${data.id}`,
      providesTags: ['Reservations'],
    }),
    updateReservation: builder.mutation({
      query: (reserv) => ({
        url: `${JOURNEYS_URL}/${reserv.journeyNo}/reservations/${reserv.id}`,
        method: 'PUT',
        body: reserv,
      }),
      invalidatesTags: ['Reservations'],
    }),
    addReservation: builder.mutation({
      query: (reserv) => ({
        url: `${JOURNEYS_URL}/${reserv.journeyNo}/reservations`,
        method: 'POST',
        body: reserv,
      }),
      invalidatesTags: ['Reservations'],
    }),
    deleteReservation: builder.mutation({
      query: (reserv) => ({
        url: `${JOURNEYS_URL}/${reserv.journeyNo}/reservations/${reserv.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reservations'],
    }),
    getAllExpenses: builder.query({
      query: (journeyNo) => `${JOURNEYS_URL}/${journeyNo}/expenses`,
      providesTags: ['JrnExpenses'],
    }),
    getExpense: builder.query({
      query: (data) => `${JOURNEYS_URL}/${data.journeyNo}/expenses/${data.id}`,
      providesTags: ['JrnExpenses'],
    }),
    addExpense: builder.mutation({
      query: (expense) => ({
        url: `${JOURNEYS_URL}/${expense.journeyNo}/expenses`,
        method: 'POST',
        body: expense,
      }),
      invalidatesTags: ['JrnExpenses'],
    }),
    deleteExpense: builder.mutation({
      query: (expense) => ({
        url: `${JOURNEYS_URL}/${expense.journeyNo}/expenses/${expense.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['JrnExpenses'],
    }),
    getAllIncomes: builder.query({
      query: (journeyNo) => `${JOURNEYS_URL}/${journeyNo}/incomes`,
      providesTags: ['JrnIncomes'],
    }),
    getIncome: builder.query({
      query: (data) => `${JOURNEYS_URL}/${data.journeyNo}/incomes/${data.id}`,
      providesTags: ['JrnIncomes'],
    }),
    addIncome: builder.mutation({
      query: (income) => ({
        url: `${JOURNEYS_URL}/${income.journeyNo}/incomes`,
        method: 'POST',
        body: income,
      }),
      invalidatesTags: ['JrnIncomes'],
    }),
    deleteIncome: builder.mutation({
      query: (income) => ({
        url: `${JOURNEYS_URL}/${income.journeyNo}/incomes/${income.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['JrnIncomes'],
    }),
  }),
});

export const {
  useGetAllJourneysQuery,
  useGetJourneyQuery,
  useAddJourneyMutation,
  useUpdateJourneyMutation,
  useDeleteJourneyMutation,
  useGetAllReservationsQuery,
  useGetReservationQuery,
  useAddReservationMutation,
  useUpdateReservationMutation,
  useDeleteReservationMutation,
  useGetAllExpensesQuery,
  useGetExpenseQuery,
  useAddExpenseMutation,
  useDeleteExpenseMutation,
  useGetAllIncomesQuery,
  useGetIncomeQuery,
  useAddIncomeMutation,
  useDeleteIncomeMutation,
} = journeysApiSlice;
