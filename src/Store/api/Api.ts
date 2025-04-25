import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    LoginUserPayload,
    LoginUserResponse,
    RegistrationUserPayload,
    RegistrationUserResponse,
    VerifyCodePayload,
    VerifyCodeResponse,
    GetUserInfoResponse,
    UpdateUserInfoResponse,
    MyOffer,
    OfferFilters,
    OffersResponse,
    HomeStatistics,
    OfferDetail,
} from "./types";
import { baseUrl } from "../../utils/baseUrl";
import { ICard } from "../../components/Cards/Interfaces";

export const AuthApi = createApi({
    reducerPath: "Api",
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("access_token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
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
        getUserInfo: builder.query<GetUserInfoResponse, void>({
            query: () => ({
                url: "/user",
                method: "GET",
            }),
            transformResponse: (response: { data: GetUserInfoResponse }) => response.data,
        }),

        updateUserInfo: builder.mutation<UpdateUserInfoResponse, FormData>({
            query: (formData) => ({
                url: "/user",
                method: "POST",
                body: formData, 
            }),
        }),
        getHomeOffers: builder.query<
            {
                business: ICard[];
                franchise: ICard[];
                startup: ICard[];
                investments: ICard[];
            },
            string
        >({
            query: (listingType) => ({
                url: `/home-offers?listing_type=${listingType}`,
                method: "GET",
            }),
        }),
        getMainStatistics: builder.query<HomeStatistics, void>({
            query: () => '/home/statistics',
        }),
        getMyOffers: builder.query<{ offers: { data: MyOffer[] } }, number>({
            query: (perPage) => `/my-offers?per_page=${perPage}`,
        }),
        getOffers: builder.query<OffersResponse, OfferFilters>({
            query: (params) => ({
                url: "/offers",
                method: "GET",
                params,
            }),
        }),
        getOfferById: builder.query<OfferDetail, number>({
            query: (id) => `/offers/${id}`,
          }),
    }),

});

export const {
    useLoginUserMutation,
    useRegistrationUserMutation,
    useVerifyPhoneCodeMutation,
    useGetUserInfoQuery,
    useUpdateUserInfoMutation,
    useGetHomeOffersQuery,
    useGetMyOffersQuery,
    useGetOffersQuery,
    useGetMainStatisticsQuery,
    useGetOfferByIdQuery,
} = AuthApi;
