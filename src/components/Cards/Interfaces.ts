
export interface ICard {
    type: "бизнес" | "франшиза" | "стартап" | "инвестиции";
    id: number;
    image?: string | null;
    price: string;
    title: string;
    address: string;
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