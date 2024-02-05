import { apiSlice } from '../api/apiSlice';

const DRIVERS_URL = '/api/drivers';

export const driversApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDrivers: builder.query({
      query: () => `${DRIVERS_URL}`,
      providesTags: ['Drivers'],
    }),
    getDriver: builder.query({
      query: (driverId) => `${DRIVERS_URL}/${driverId}`,
      providesTags: ['Drivers'],
    }),
    addDriver: builder.mutation({
      query: (driver) => ({
        url: `${DRIVERS_URL}`,
        method: 'POST',
        body: driver,
      }),
      invalidatesTags: ['Drivers'],
    }),
    updateDriver: builder.mutation({
      query: (update) => ({
        url: `${DRIVERS_URL}/${update.id}`,
        method: 'PUT',
        body: update,
      }),
      invalidatesTags: ['Drivers'],
    }),
    deleteDriver: builder.mutation({
      query: (id) => ({
        url: `${DRIVERS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Drivers'],
    }),
  }),
});

export const {
  useGetAllDriversQuery,
  useGetDriverQuery,
  useAddDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} = driversApiSlice;
