import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '',
});

export const apiSlice = createApi({
  reducerPath: 'RihlaApi',
  baseQuery,
  tagTypes: [
    'Users',
    'Fleet',
    'Drivers',
    'Destinations',
    'Journeys',
    'Reservations',
    'Companies',
    'JrnExpenses',
    'JrnIncomes',
  ],
  endpoints: (builder) => ({}),
});
