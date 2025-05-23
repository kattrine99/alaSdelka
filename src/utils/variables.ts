export const categories = [
    { label: "Бизнес", to: "/business" },
    { label: "Франшиза", to: "/franchise" },
    { label: "Инвестиции", to: "/investments" },
    { label: "Стартапы", to: "/startup" },
];

export const personalpages = [
    { label: "Мои объявления", to: "/announcement" },
    { label: "Уведомления", to: "/notices" },
    { label: "Избранное", to: "/favorites" },
    { label: "Продвижение", to: "/promotion" },
]

export interface FiltersState {
    category_id?: number;
    categories?: { id: number };
    category: string;
    city: string;
    stage: string;
    paybackPeriod: string;
    priceMin: string;
    priceMax: string;
    investmentMin: string;
    investmentMax: string;
    profitabilityMin: string;
    profitabilityMax: string;
    listing_type?: "buy" | "sell" | "" | null;
    offer_type: "business" | "startup" | "franchise" | "investments" | "" | null;
}
export interface FileMeta {
    name: string;
    size: number;
    type: string;
}
