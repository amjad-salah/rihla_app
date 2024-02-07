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
  }),
});

export const {
  useGetAllJourneysQuery,
  useGetJourneyQuery,
  useAddJourneyMutation,
  useUpdateJourneyMutation,
  useDeleteJourneyMutation,
  useGetAllReservationsQuery,
  useAddReservationMutation,
  useDeleteReservationMutation,
} = journeysApiSlice;
