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

export interface RequestPasswordResetPayload {
    phone: string;
}

export interface PasswordResetPayload {
    phone: string;
    password: string;
    code: string;
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
    data: [
        {
            offer_type?: "business" | "franchise" | "startup" | "investments";
            id: number;
            slug: string;
            title: string;
            price: number;
            area: number;
            offer_status: string;
            is_paid: boolean;
            paid_offer?: {
                tariff_id: number;
                tarrif_name: string;
                start_date: string;
                end_date: string;
                is_active: boolean;
                promotion_days_left: number;
            }
            address: {
                address: string;
                city: {
                    id?: number;
                    name_ru: string;
                    name_uz: string;
                };
            };
            photos: { photo: string }[];
        }
    ]
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}
export interface OfferFilters {
    page: number;
    per_page: number;
    offer_type: "business" | "franchise" | "startup" | "investments";
    category?: string;
    category_slug?: string;
    listing_type?: "buy" | "sell" | "" | null;
    city?: object;
    stage?: string;
    price_min?: string;
    price_max?: string;
    area_from?: string;
    area_to?: string;
    investment_min?: string;
    investment_max?: string;
    profitability_min?: string;
    profitability_max?: string;
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

interface SeoHomeSettings {
    title: string;
    description: string;
    keywords?: string;
}

interface SeoBusinessSettings {
    title: string;
    description: string;
    keywords?: string;
    content_top: string | null;
    content_bottom: string | null;
}

interface SeoFranchiseSettings {
    title: string;
    description: string;
    keywords?: string;
    content_top: string | null;
    content_bottom: string | null;
}

interface SeoInvestmentsSettings {
    title: string;
    description: string;
    keywords?: string;
    content_top: string | null;
    content_bottom: string | null;
}

interface SeoStartupSettings {
    title: string;
    description: string;
    keywords?: string;
    content_top: string | null;
    content_bottom: string | null;
}

export interface SeoSettings {
    home: SeoHomeSettings;
    business: SeoBusinessSettings;
    franchise: SeoFranchiseSettings;
    investments: SeoInvestmentsSettings;
    startups: SeoStartupSettings;
    sitemap_url: string | null;
    google_analytics_id: string | null;
    yandex_metrika_id: string | null;
    google_site_verification: string | null;
    yandex_verification: string | null;
    robots_txt: string | null;
    enable_og_tags: boolean;
    enable_schema_markup: boolean;
}

export interface ContactsSocialSettings {
    telegram: string | null;
    whatsapp: string | null;
    instagram: string | null;
    facebook: string | null;
    linkedin: string | null;
    youtube: string | null;
}

export interface ContactsSettings {
    email: string | null;
    phone: string | null;
    phone_secondary: string | null;
    address: string | null;
    work_hours: string | null;
    social: ContactsSocialSettings;
}

export interface SiteSettings {
    seo: SeoSettings;
    contacts: ContactsSettings;
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
        area_from: number | null;
        area_to: number | null;
        view_count: number;
        closed_successfully: boolean;
        offer_status: string;
        user_name: string;
        user_phone: string;
        user_photo: string;
        user_created_at: string,
        user_id: number,
        is_paid: boolean;
        is_favourite: boolean;
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
export interface SellOfferResponse {
    message: string;
    data: OfferDetails
}
export interface OfferDetails {
    is_favourite: boolean;
    id: number;
    slug: string,
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
    is_favourite: boolean;
    id: number;
    slug: string;
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
export interface FavoritesResponseType {
    data: Offer[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}



export interface FilterData {
    cities: [
        {
            id: number,
            name_ru: string,
            name_uz: string,
            slug: string,
        }
    ],
    categories: [
        {
            id: number,
            title_ru: string,
            title_uz: string,
            slug: string,
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
    publish_tariffs: [
        {
            id: number,
            name: string,
            price: number,
            duration_in_days: number,
        }
    ],
    premises_ownership_form: [
        {
            value: string,
            label_ru: string,
            label_uz: string
        }
    ]
}
export interface Notification {
    id: number;
    title_ru: string;
    title_uz: string;
    text_ru: string;
    text_uz: string;
    is_read: boolean;
    type: string;
    offer_id: number;
    offer_slug: string;
    offer_status: string;
    user_id?: number;
    created_at: string;
    updated_at: string;

}
export interface Notifications {
    data: Notification[],
    links: object,
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        unread_count: number;
    };
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
interface PhotoData {
    id?: number;
    photo: File | string;
    preview?: string;
    order: number;
}

interface DocumentData {
    id?: number;
    document: File | string;
    name: string;
}
export interface OfferPayload {
    area: number;
    area_from: number | null;
    area_to: number | null;
    id?: number;
    slug?: string;
    title: string;
    description: string;
    listing_type: "buy" | "sell";
    offer_type: "business" | "franchise" | "startup" | "investments";
    user_name: string;
    user_phone: string;
    address?: {
        address: string;
        city_id: number;
        latitude?: number;
        longitude?: number;
    }

    city_name?: string;
    category_id: number;

    price: number;

    business_type?: string;
    conveniences: number[];

    // SELL-specific
    property_ownership_type?: string;
    documents: DocumentData[];
    photos: PhotoData[];
    communication_channels?: { channel_name: string; link: string }[];
    business_share?: number;
    premises_ownership_form?: string;
    average_monthly_revenue?: number;
    average_monthly_profit?: number;
    payback_period?: number;
    average_monthly_expenses?: number;
    percentage_for_sale?: number;
    foundation_year?: number;
    profitability?: number;
    employee_count?: number;
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
export interface PhotoResponse {
    id: number;
    photo: string;
    order: number;
}

export interface DocumentResponse {
    id: number;
    document: string;
}

export interface OfferResponse {
    id: number;
    photos?: PhotoResponse[];
    documents?: DocumentResponse[];
    slug: string;
}
export interface UserCard {
    id: number;
    expire: string;
    masked_number: string;
    card_type: "UZCARD" | "HUMO" | string;
    is_verified: boolean;
}

export interface UserCardsResponse {
    cards: UserCard[];
}
export interface AddCardPayload {
    card_number: string;
    expire: string;
    card_type?: string;
    is_default?: boolean;
}
export interface AddCardResponse {

    message: string;
    card: {
        id: number;
        masked_number: string;
        card_type: "UZCARD" | "HUMO" | string;
        is_verified: boolean;
        is_default: boolean;

    }
    phone: string;
}
export interface VerifyCardPayload {
    card_id: number;
    code: string;
}
export interface VerifyCardResponse {
    message: string;
    card: {
        id: number;
        masked_number: string;
        card_type: "UZCARD" | "HUMO" | string;
        is_verified: boolean;
        is_default: boolean;

    }
}
export interface TempOfferState {
    offerData?: OfferPayload;
    offerId?: number;
}
export interface UpdateOfferPayload {
    title: string;
    description: string;
    user_name: string;
    user_phone: string;
    premises_ownership_form: string;
    business_type: string;
    category_id: number;
    project_stage_id: number;
    price: number;
    average_monthly_revenue: number;
    average_monthly_profit: number;
    average_monthly_expenses: number;
    percentage_for_sale: number;
    profitability: number;
    foundation_year: number;
    employee_count: number;
    area: number;
    address: {
        address: string;
        latitude: number;
        longitude: number;
        city_id: number;
    };
    conveniences: number[];
    communication_channels: {
        channel_name: string;
        link: string;
    }[];
}

export interface CategorySeo {
    title: string;
    description: string;
    keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    canonical_url?: string;
    is_indexable: boolean;
    content_top?: string;
    content_bottom?: string;
}

export interface CitySeo {
    title: string;
    description: string;
    keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    canonical_url?: string;
    is_indexable: boolean;
    content_top?: string;
    content_bottom?: string;
    schema_data?: Record<string, any>;
}
