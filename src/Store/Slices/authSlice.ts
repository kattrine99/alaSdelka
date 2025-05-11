import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  logoutReason: string | null;

}

const initialState: AuthState = {
  isAuthenticated: false,
  logoutReason: null,

};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setLogoutReason(state, action: PayloadAction<string | null>) {
      state.logoutReason = action.payload;
    },
  },
});


export const { setIsAuthenticated, setLogoutReason } = authSlice.actions;
export default authSlice.reducer;