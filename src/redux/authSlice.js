import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  role: Cookies.get("role") || null,
  mentorId: Cookies.get("mentorId") || null,
  bootcamperId: Cookies.get("bootcamperId") || null,
  mentorName: Cookies.get("mentorName") || null,
  bootcamperName: Cookies.get("bootcamperName") || null,
  isAuthenticated: !!Cookies.get("role"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.role = Cookies.get("role") || null;
      state.mentorId = Cookies.get("mentorId") || null;
      state.bootcamperId = Cookies.get("bootcamperId") || null;
      state.mentorName = Cookies.get("mentorName") || null;
      state.bootcamperName = Cookies.get("bootcamperName") || null;
      state.isAuthenticated = !!state.role;
    },
    logout: (state) => {
      state.role = null;
      state.mentorId = null;
      state.bootcamperId = null;
      state.mentorName = null;
      state.bootcamperName = null;
      state.isAuthenticated = false;

      Cookies.remove("role");
      Cookies.remove("mentorId");
      Cookies.remove("bootcamperId");
      Cookies.remove("mentorName");
      Cookies.remove("bootcamperName");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
