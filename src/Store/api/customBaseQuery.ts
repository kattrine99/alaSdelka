// customBaseQuery.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../Slices/authSlice";
import { setSessionExpired } from "../Slices/uiSlice";
import qs from "qs";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "https://investin-api.comingsoon.uz/api",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("accessToken");
        if (token) headers.set("Authorization", `Bearer ${token}`);
        headers.set("Accept", "application/json");
        return headers;
    },
    paramsSerializer: (params) => qs.stringify(params),
});

const customBaseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        localStorage.removeItem("accessToken");
        api.dispatch(logout());
        api.dispatch(setSessionExpired(true));
    }

    return result;
};

export default customBaseQuery;
