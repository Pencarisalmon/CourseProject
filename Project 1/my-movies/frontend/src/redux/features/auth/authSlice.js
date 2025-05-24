import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfor: localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor"))
    : null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfor = action.payload;
      localStorage.setItem("userInfor", JSON.stringify(action.payload));
      const expirationDate = new Date().getTime() + 60 * 60 * 1000; // 1 hour
      localStorage.setItem("expirationDate", expirationDate);
    },
    logOut: (state) => {
      state.userInfor = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
