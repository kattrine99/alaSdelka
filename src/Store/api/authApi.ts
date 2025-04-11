import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    GetUserByIdResponse,
    LoginUserPayload,
    LoginUserResponse,
    RegistrationUserPayload,
    RegistrationUserResponse,
    VerifyCodePayload,
    VerifyCodeResponse,
} from "./types";
import { baseUrl } from "../../utils/baseUrl";

export const AuthApi = createApi({
    reducerPath: "AuthApi",
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getUserById: builder.query<GetUserByIdResponse, number>({
            query: (user_id) => `/user?user_id=${user_id}`,
        }),
        loginUser: builder.mutation<LoginUserResponse, LoginUserPayload>({
            query: (payload) => ({
                url: "/login",
                method: "POST",
                body: payload,
            }),
        }),
        registrationUser: builder.mutation<RegistrationUserResponse, RegistrationUserPayload>({
            query: (payload) => ({
                url: "/register",
                method: "POST",
                body: payload,
            }),
        }),

        verifyPhoneCode: builder.mutation<VerifyCodeResponse, VerifyCodePayload>({
            query: (payload) => ({
                url: "/verify-code",
                method: "POST",
                body: payload,
            }),
        }),
    }),
});

export const {
    useGetUserByIdQuery,
    useLoginUserMutation,
    useRegistrationUserMutation,
    useVerifyPhoneCodeMutation
} = AuthApi;
