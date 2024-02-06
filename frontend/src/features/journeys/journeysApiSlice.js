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
  }),
});

export const {
  useGetAllJourneysQuery,
  useGetJourneyQuery,
  useAddJourneyMutation,
  useUpdateJourneyMutation,
  useDeleteJourneyMutation,
} = journeysApiSlice;
