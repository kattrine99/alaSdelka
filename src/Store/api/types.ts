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
        business: CityStats[];
        franchise: CityStats[];
        startup: CityStats[];
        investments: CityStats[];
    };
    offers_count: number;
    partners_count: number;
    deals_count: number;
    total_sold_amount: number;
}

interface CityStats {
    city_id: number;
    name_ru: string;
    name_uz: string;
    offers_count: number;
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
        percentage_for_sale: number;
        profitability: number;
        foundation_year: number;
        employee_count: number;
        area: number;
        view_count: number;
        closed_successfully: boolean;
        offer_status: string;
        user_name: string;
        user_phone: string;
        user_photo: string;
        user_created_at: string,
        user_id: number,
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
export interface OfferDetails {
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
    percentage_for_sale: number;
    profitability: number;
    foundation_year: number;
    employee_count: number;
    area: number;
    view_count: number;
    closed_successfully: boolean;
    offer_status: string;
    user_name: string;
    user_phone: string;
    user_photo: string;
    user_created_at: string,
    user_id: number,
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

export interface Offer {
    id: number;
    title: string;
    price: number;
    area: number;
    offer_type: "business" | "franchise" | "startup" | "investments";
    photos?: { id: number; photo: string; order: number }[];
    address?: {
        address: string;
        city?: { name_ru: string };
    };
    offer_status?: string;
}



export interface FilterData {
    cities: [
        {
            id: number,
            name_ru: string,
            name_uz: string
        }
    ],
    categories: [
        {
            id: number,
            title_ru: string,
            title_uz: string
        }
    ],
    project_stages: [
        {
            id: number,
            name_ru: string,
            name_uz: string
        }
    ],
    conveniences: [
        {
            id: number,
            name_ru: string,
            name_uz: string
        }
    ],
    business_types: [
        {
            value: string,
            label_ru: string,
            label_uz: string,
        }
    ],
    listing_types: [
        {
            value: string,
            label_ru: string,
            label_uz: string,
        }
    ],
    offer_types: [
        {
            value: string,
            label_ru: string,
            label_uz: string,
        }
    ],
    offer_statuses: [
        {
            value: string,
            label_ru: string,
            label_uz: string,
        }
    ],
    tariffs: [
        {
            id: number,
            name: string,
            price: number,
            duration: number,
        }
    ],
}
export interface Notification {
    title_ru: string;
    title_uz: string;
    text_ru: string;
    text_uz: string;
    created_at: string;
    updated_at: string;
}
export interface Notifications {
    data: Notification[],
    links: object,
    meta: object,
}
export interface FavoritesResponse {
    data: OfferDetail[];
    meta?: object;
    links?: object;
}
export interface GetUserOffersResponse {
    user: {
        id: number;
        name: string;
        phone: string;
        email: string;
        photo: string;
        created_at: string;
        updated_at: string;
    };
    offers: OfferDetails[];
    user_offers_count: number;
}
export interface GetUserOffersParams {
    user_id: number;
    user_phone?: string;
    per_page?: number;
    page?: number;
    search?: string;
    category_id?: number;
    price_min?: number;
    price_max?: number;
    listing_type?: "sell" | "buy";
    offer_type?: "business" | "startup" | "franchise" | "investments";
    city_id?: number;
}
export interface OfferPayload {
    area: number;
    id?: number;
    title: string;
    description: string;
    listing_type: "buy" | "sell";
    offer_type: "business" | "franchise" | "startup" | "investments";
    user_name: string;
    user_phone: string;
    address?: string;
    city_id: string;
    city_name?: string;
    category_id: string;

    amount: number;

    business_type?: string;
    convenience_ids: number[];

    // SELL-specific
    property_ownership_type?: string;
    documents?: { document: File }[];
    images?: { photo: File, order: number }[];
    communication_links?: string[];
    business_share?: string;
    monthly_income?: string;
    profit?: string;
    payback_period?: string;
    foundation_year?: string;

    // BUY
    legal_form?: string;

    // Startup
    project_stage_id?: number;

    // Franchise
    is_international_franchise?: boolean;
    has_master_franchise?: boolean;

    // Investments
    has_copyrights?: boolean;
}
export interface DailyStats {
    date: string;
    view_count: number;
    favourite_count: number;
    contact_view_count: number;
}

export interface StatMetric {
    current_week: number;
    previous_week: number;
    change: number;
}

export interface OfferStatsResponse {
    data: DailyStats[];
    metrics: {
        view_count: StatMetric;
        favourite_count: StatMetric;
        contact_view_count: StatMetric;
    };
}
