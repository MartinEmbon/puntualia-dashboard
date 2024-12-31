import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    username: null,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.username = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
    },
    setAuthStatus: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.username = action.payload.username;
    },
  },
});

export const { login, logout, setAuthStatus } = authSlice.actions;

export default authSlice.reducer;
