
export interface ICard {
    is_paid?: boolean;
    offer_type: "бизнес" | "франшиза" | "стартап" | "инвестиции" | "business" | "franchise" | "startup" | "investments";
    id: number;
    image?: File | string | null;
    photos?: {
        id: number;
        photo: string;
        order: number;
    }[];
    price: number;
    title: string;
    description?: string;
    address: {
        address: string;
        city: {
            name_ru: string;
            name_uz: string;
        };
        longitude?: number;
        latitude?: number;
    };
    area: number | string;
    offer_status?: string;
    category?: string;
    is_favourite?: boolean;
    listing_type?: string;
    user_phone?: string;
}

export interface ICards {
    cards: ICard[];
    initialFavorites?: number[];
    onFavoritesChanged?: (id: number, status: "added" | "removed") => void; WhatchButtonClass?: string;
    containerClass?: string;
    cardWrapperClass?: string;
    cardIconClass?: string;
    cardHeadingClass?: string;
    cardTextClass?: string;
}