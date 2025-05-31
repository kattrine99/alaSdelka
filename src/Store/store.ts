import { configureStore } from "@reduxjs/toolkit";
import { AuthApi } from "./api/Api";
import authReducer from "./Slices/authSlice";
import uiReducer from "./Slices/uiSlice";
import tempOfferReducer from "./tempStorage";
import favoritesSlice from './Slices/favoriteSlice';
import currencyReducer from './Slices/currencySlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        tempOffer: tempOfferReducer,
        ui: uiReducer,
        favorites: favoritesSlice,
        currency: currencyReducer,
        [AuthApi.reducerPath]: AuthApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(AuthApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

