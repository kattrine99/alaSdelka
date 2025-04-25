
export interface ICard {
    offer_type: "бизнес" | "франшиза" | "стартап" | "инвестиции" | "business" | "franchise" | "startup" | "investments";
    id: number;
    image?: string | null;
    price: string;
    title: string;
    address: {
        address: string;
        city: {
            name_ru: string;
        };
    };
    area: string;
    popular: boolean;
    category?: string;
}

export interface ICards {
    cards: ICard[];
    containerClass?: string;
    cardWrapperClass?: string;
    cardIconClass?: string;
    cardHeadingClass?: string;
    cardTextClass?: string;
}