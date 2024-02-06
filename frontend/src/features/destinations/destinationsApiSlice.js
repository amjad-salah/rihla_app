import { apiSlice } from '../api/apiSlice';

const DESTS_URL = '/api/destinations';

export const destinationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDestinations: builder.query({
      query: () => `${DESTS_URL}`,
      providesTags: ['Destinations'],
    }),
    getDestination: builder.query({
      query: (destinationId) => `${DESTS_URL}/${destinationId}`,
      providesTags: ['Destinations'],
    }),
    addDestination: builder.mutation({
      query: (destination) => ({
        url: `${DESTS_URL}`,
        method: 'POST',
        body: destination,
      }),
      invalidatesTags: ['Destinations'],
    }),
    updateDestination: builder.mutation({
      query: (update) => ({
        url: `${DESTS_URL}/${update.id}`,
        method: 'PUT',
        body: update,
      }),
      invalidatesTags: ['Destinations'],
    }),
    deleteDestination: builder.mutation({
      query: (id) => ({
        url: `${DESTS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Destinations'],
    }),
  }),
});

export const {
  useGetAllDestinationsQuery,
  useGetDestinationQuery,
  useAddDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} = destinationsApiSlice;
