import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LogoutReason = "expired" | "unauthorized" | null;

interface AuthState {
  isAuthenticated: boolean;
  logoutReason: LogoutReason;
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
    setLogoutReason(state, action: PayloadAction<LogoutReason>) {
      state.logoutReason = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.logoutReason = null;
    },
  },
});

export const { setIsAuthenticated, setLogoutReason, logout } = authSlice.actions;
export default authSlice.reducer;
