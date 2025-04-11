import { configureStore } from "@reduxjs/toolkit";
import { AuthApi } from "./api/authApi";
import authReducer from "./Slices/authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [AuthApi.reducerPath]: AuthApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(AuthApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
