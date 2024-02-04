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
    addVehicle: builder.mutation({
      query: (vehicle) => ({
        url: `${FLEET_URL}`,
        method: 'POST',
        body: vehicle,
      }),
      invalidatesTags: ['Fleet'],
    }),
    updateVehicle: builder.mutation({
      query: (update) => ({
        url: `${FLEET_URL}/${update.code}`,
        method: 'PUT',
        body: update,
      }),
      invalidatesTags: ['Fleet'],
    }),
    deleteVehicle: builder.mutation({
      query: (code) => ({
        url: `${FLEET_URL}/${code}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Fleet'],
    }),
    getVehicleExps: builder.query({
      query: (code) => `${FLEET_URL}/${code}/expenses`,
      providesTags: ['Fleet'],
    }),
    addVehicleExp: builder.mutation({
      query: (expense) => ({
        url: `${FLEET_URL}/${expense.code}/expenses`,
        method: 'POST',
        body: expense,
      }),
      invalidatesTags: ['Fleet'],
    }),
    deleteVehicleExp: builder.mutation({
      query: (data) => ({
        url: `${FLEET_URL}/${data.vehCode}/expenses/${data.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Fleet'],
    }),
  }),
});

export const {
  useGetAllVehiclesQuery,
  useGetVehicleQuery,
  useAddVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useGetVehicleExpsQuery,
  useAddVehicleExpMutation,
  useDeleteVehicleExpMutation,
} = fleetApiSlice;
