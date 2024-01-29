import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentail: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearCredential: (state, action) => {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentail, clearCredential } = authSlice.actions;
export default authSlice.reducer;
