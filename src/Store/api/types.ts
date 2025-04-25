import { ICard } from "../../components/Cards/Interfaces";


export interface RegistrationUserPayload {
    name: string;
    phone: string;
    password: string;
    password_confirmation: string;
}

export interface RegistrationUserResponse {
    message: string;
    user: {
        id: number;
        name: string;
        phone: string;
    };
}

export interface LoginUserPayload {
    phone: string;
    password: string;
}

export interface LoginUserResponse {
    message: string;
    access_token: string;
    expires_in: number;
    user: {
        id: number;
        name: string;
        phone: string;
    };
}

export interface GetUserByIdResponse {
    id: number;
    name: string;
    phone: string;
}

export interface SendCodeResponse {
    message: string;
}

export interface VerifyCodePayload {
    phone: string;
    code: string;
}

export interface VerifyCodeResponse {
    message: string;
    access_token: string;
    token_type: string;
    expires_in: number;
    user: {
        id: number;
        name: string;
        phone: string;
        email: string;
        photo: string;
    };
}
export interface GetUserInfoResponse {
    city: {
        id: number;
        name_ru: string;
        name_uz: string;
    };
    id: number;
    name: string;
    phone: string;
    email: string;
    photo: string;
}

export interface UpdateUserInfoResponse {
    id: number;
    name: string;
    phone: string;
    email: string;
    photo: string;
    city: {
        id: number;
        name_ru: string;
        name_uz: string;
    };
}

export interface MyOffer {
    id: number;
    title: string;
    price: number;
    area: number;
    offer_status: string;
    address: {
        address: string;
        city: {
            name_ru: string;
        };
    };
    photos: { photo: string }[];
}
export interface OfferFilters {
    page: number;
    per_page: number;
    offer_type: "business" | "franchise" | "startup" | "investments";
    category?: string;
    city?: object;
    stage?: string;
    price_from?: string;
    price_to?: string;
    investment_from?: string;
    investment_to?: string;
    profitability_from?: string;
    profitability_to?: string;
}

export interface OffersMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface OffersResponse {
    data: ICard[];
    meta: OffersMeta;
}
export interface HomeStatistics {
    cities_statistics: {
        city_id: number;
        name_ru: string;
        offers_count: number;
    }[];
    offers_count: number;
    partners_count: number;
    deals_count: number;
    total_sold_amount: string;
}
export interface OfferDetail {
    data: {
        id: number;
        title: string;
        description: string;
        listing_type: "sell" | "buy";
        business_type: string;
        offer_type: "business" | "franchise" | "startup" | "investments";
        premises_ownership_form: string;
        price: number;
        payback_period: number;
        average_monthly_revenue: number;
        average_monthly_profit: number;
        average_monthly_expenses: number;
        percentage_of_sale: number;
        profitability: number;
        foundation_year: number;
        employee_count: number;
        area: number;
        view_count: number;
        closed_successfully: boolean;
        offer_status: string;
        user_name: string;
        user_phone: string;
        is_paid: boolean;
        created_at: string;
        updated_at: string;
        photos: [
            {
                id: number,
                photo: string,
                order: number
            }
        ];
        documents: [{
            id: number,
            document: string
        }];
        address: {
            address: string,
            latitude: number,
            longitude: number,
            city: {
                id: number,
                name_ru: string,
                name_uz: string
            }
        }
        category: {
            id: number,
            title_ru: string,
            title_uz: string
        },
        project_stage: {
            id: number,
            name_ru: string,
            name_uz: string
        },
        conveniences: [
            {
                id: number,
                name_ru: string,
                name_uz: string
            }
        ],
        communication_channels: [
            {
                channel_name: string,
                link: string
            }
        ],
    }
}