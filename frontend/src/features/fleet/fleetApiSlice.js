import { apiSlice } from '../api/apiSlice';

const FLEET_URL = '/api/fleet';

export const fleetApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllVehicles: builder.query({
      query: () => `${FLEET_URL}`,
      providesTags: ['Fleet'],
    }),

    getVehicle: builder.query({
      query: (code) => `${FLEET_URL}/${code}`,
      providesTags: ['Fleet'],
    }),
  }),
});

export const { useGetAllVehiclesQuery, useGetVehicleQuery } = fleetApiSlice;
