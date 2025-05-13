
export interface ICard {
    offer_type: "бизнес" | "франшиза" | "стартап" | "инвестиции" | "business" | "franchise" | "startup" | "investments";
    id: number;
    image?: string | null;
    price: number;
    title: string;
    description?: string;
    address: {
        address: string;
        city: {
            name_ru: string;
        };
    };
    area: string;
    popular?: boolean;
    category?: string;
    is_favorite?: boolean;
    listing_type?: string;
    user_phone?: string;
}

export interface ICards {
    cards: ICard[];
    initialFavorites?: number[];
    onFavoritesChanged?: () => void;
    WhatchButtonClass?: string;
    containerClass?: string;
    cardWrapperClass?: string;
    cardIconClass?: string;
    cardHeadingClass?: string;
    cardTextClass?: string;
}