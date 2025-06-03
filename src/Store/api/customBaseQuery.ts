import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setLogoutReason } from "../Slices/authSlice";
import qs from "qs";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "https://api.invin.uz/api",
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
    console.log(result)
    if (result.error?.status === 401) {
        const expiresAt = localStorage.getItem("expiresAt");
        const isExpired = expiresAt && Date.now() > Number(expiresAt);

        if (isExpired) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("expiresAt");
            api.dispatch(logout());
            api.dispatch(setLogoutReason("expired"));
        } else {
            api.dispatch(setLogoutReason("unauthorized"));
        }
    }

    return result;
};


export default customBaseQuery;
