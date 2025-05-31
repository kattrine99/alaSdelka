import { createApi } from "@reduxjs/toolkit/query/react";
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
    FilterData,
    Notifications,
    GetUserOffersResponse,
    GetUserOffersParams,
    OfferStatsResponse,
    SellOfferResponse,
    OfferResponse,
    UserCardsResponse,
    AddCardResponse,
    AddCardPayload,
    VerifyCardResponse,
    VerifyCardPayload,
} from "./types";
import { ICard } from "../../components/Cards/Interfaces";
import customBaseQuery from "./customBaseQuery";


export const AuthApi = createApi({
    reducerPath: "Api",
    baseQuery: customBaseQuery,
    tagTypes: ['Favorites'],
    endpoints: (builder) => ({
        //Авторизация и выход
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
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/logout",
                method: "POST",
            }),
        }),
        //Главная
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
        getCurrencyRate: builder.query<{ rate: number }, void>({
            query: () => "/currency/usd-uzs",
        }),
        getMyOffers: builder.query<MyOffer, { page: number; per_page?: number; is_paid?: boolean; }>({
            query: ({ page, per_page = 5 }) =>
                `/my-offers?page=${page}&per_page=${per_page}`,
        }),

        sellOffer: builder.mutation<SellOfferResponse, number>({
            query: (offerId) => ({
                url: `/offer/${offerId}/sell`,
                method: "POST",
            }),
        }),
        archiveOffer: builder.mutation<void, number>({
            query: (offerId) => ({
                url: `/offer/${offerId}/archive`,
                method: "POST",
            }),
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
        getFiltersData: builder.query<FilterData, void>({
            query: () => ({
                url: "/filters",
                method: "GET",
            }),
        }),
        toggleFavorite: builder.mutation({
            query: ({ id }) => ({
                url: `/favourite-offers/${id}`,
                method: "POST",
            }),
            invalidatesTags: ["Favorites"],
        }),
        getFavorites: builder.query({
            query: (params) => ({
                url: "/favourite-offers",
                params,
            }),
            providesTags: ["Favorites"],
        }),

        getNotifications: builder.query<Notifications, { page: number; per_page?: number; }>({
            query: ({ page, per_page = 5 }) => `/notifications?page=${page}&per_page=${per_page}`,
        }),
        getUserOffers: builder.query<GetUserOffersResponse, GetUserOffersParams>({
            query: ({ user_id, ...params }) => ({
                url: `/users/${user_id}/offers`,
                params,
            }),
        }),
        createOffer: builder.mutation<{ data: OfferResponse }, FormData>({
            query: (formData) => ({
                url: "/offers",
                method: "POST",
                body: formData,
            }),
        }),

        publishOffer: builder.mutation<{ data: OfferDetail }, number>({
            query: (id) => ({
                url: `/offer/${id}/publish`,
                method: "POST",
            }),
        }),
        promoteOffer: builder.mutation<
            { message: string; offer: OfferDetail },
            { tariff_id: number; offer_id: number; card_id: number }
        >({
            query: (payload) => ({
                url: "/promotions",
                method: "POST",
                body: payload,
            }),
        }),
        getUserCards: builder.query<UserCardsResponse, void>({
            query: () => ({
                url: "/user/cards",
                method: "GET",
            }),
        }),

        addUserCard: builder.mutation<AddCardResponse, AddCardPayload>({
            query: (payload) => ({
                url: "/user/cards",
                method: "POST",
                body: payload,
            }),
        }),

        verifyUserCard: builder.mutation<VerifyCardResponse, VerifyCardPayload>({
            query: (payload) => ({
                url: "/cards/verify",
                method: "POST",
                body: payload,
            }),
        }),
        getOfferStats: builder.query<OfferStatsResponse, { offer_id: number; from: string; to: string }>({
            query: ({ offer_id, from, to }) => ({
                url: `/offers/${offer_id}/stats`,
                method: 'GET',
                params: { from, to },
            }),
        }),
        getOfferContactView: builder.query<{ phone: string }, number>({
            query: (offerId) => `/offers/${offerId}/contact-view`
        }),
        downloadOfferDocuments: builder.query<Blob, number>({
            query: (offerId) => ({
                url: `/offers/${offerId}/documents/download`,
                method: 'GET',
                responseHandler: async (response) => response.blob(),
                headers: {
                    'Accept': 'application/zip',
                },
            }),
        }),

    }),

});

export const {
    useLoginUserMutation,
    useRegistrationUserMutation,
    useVerifyPhoneCodeMutation,
    useCreateOfferMutation,
    useLogoutMutation,
    usePublishOfferMutation,
    useUpdateUserInfoMutation,
    usePromoteOfferMutation,
    useToggleFavoriteMutation,
    useSellOfferMutation,
    useArchiveOfferMutation,
    useGetHomeOffersQuery,
    useGetMyOffersQuery,
    useGetOffersQuery,
    useGetMainStatisticsQuery,
    useGetOfferByIdQuery,
    useGetFiltersDataQuery,
    useGetFavoritesQuery,
    useGetNotificationsQuery,
    useGetUserOffersQuery,
    useGetOfferStatsQuery,
    useLazyGetOfferStatsQuery,
    useGetUserInfoQuery,
    useGetOfferContactViewQuery,
    useDownloadOfferDocumentsQuery,
    useGetUserCardsQuery,
    useGetCurrencyRateQuery,
    useAddUserCardMutation,
    useVerifyUserCardMutation,

} = AuthApi;
