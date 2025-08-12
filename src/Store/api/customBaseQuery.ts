import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setLogoutReason } from "../Slices/authSlice";
import qs from "qs";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "https://api.invin.uz/api",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("access_token");
        if (token) headers.set("Authorization", `Bearer ${token}`);
        headers.set("Accept", "application/json");
        return headers;
    },
    paramsSerializer: (params) => qs.stringify(params),
});

const customBaseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        const expiresAt = localStorage.getItem("expires_in");
        const isExpired = expiresAt && Date.now() > Number(expiresAt);

        localStorage.removeItem("access_token");
        localStorage.removeItem("expires_in");
        api.dispatch(logout());

        if (isExpired) {
            api.dispatch(setLogoutReason("expired"));
        } else {
            api.dispatch(setLogoutReason("unauthorized"));
        }
    }

    return result;
};

export default customBaseQuery;
