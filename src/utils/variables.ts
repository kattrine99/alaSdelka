export const categories = [
    { label: "Бизнес", to: "/business" },
    { label: "Франшиза", to: "/franchise" },
    { label: "Стартап", to: "/startup" },
    { label: "Инвестиции", to: "/investments" },
];

export const personalpages = [
    { label: "Мои объявления", to: "/announcement" },
    { label: "Уведомления", to: "/notices" },
    { label: "Избранное", to: "/favorites" },
]
export interface FiltersState {
    city: string;
    category: string;
    paybackPeriod?: string;
    priceMin?: string;
    priceMax?: string;
    investmentMin?: string;
    investmentMax?: string;
    profitabilityMin?: string;
    profitabilityMax?: string;
    stage?: string;
}
