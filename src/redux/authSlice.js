import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  role: Cookies.get("role") || null,
  mentorId: Cookies.get("mentorId") || null,
  bootcamperId: Cookies.get("bootcamperId") || null,
  mentorName: Cookies.get("mentorName") || null,
  bootcamperName: Cookies.get("bootcamperName") || null,
  isAuthenticated: !!Cookies.get("role"),
  jwt: Cookies.get("jwt") || null
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
      state.jwt = Cookies.get("jwt");
    },
    logout: (state) => {
      state.role = null;
      state.mentorId = null;
      state.bootcamperId = null;
      state.mentorName = null;
      state.bootcamperName = null;
      state.isAuthenticated = false;
      state.jwt = null;

      Cookies.remove("role");
      Cookies.remove("mentorId");
      Cookies.remove("bootcamperId");
      Cookies.remove("mentorName");
      Cookies.remove("bootcamperName");
      Cookies.remove("jwt");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
