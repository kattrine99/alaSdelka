import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LogoutReason = "expired" | "unauthorized" | null;

interface AuthState {
  isAuthenticated: boolean;
  logoutReason: LogoutReason;
  accessToken: string | null;
  authReady: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  logoutReason: null,
  accessToken: null,
  authReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setLogoutReason(state, action: PayloadAction<LogoutReason>) {
      state.logoutReason = action.payload;
    },
    setAuthReady(state, action: PayloadAction<boolean>) {
      state.authReady = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.logoutReason = null;
      state.accessToken = null;
    },
  },
});

export const {
  setIsAuthenticated,
  setAccessToken,
  setLogoutReason,
  setAuthReady,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
