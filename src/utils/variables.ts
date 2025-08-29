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
export const ruToEnOfferTypeMap: Record<string, "business" | "franchise" | "startup" | "investments"> = {
    "бизнес": "business",
    "франшиза": "franchise",
    "стартап": "startup",
    "инвестиции": "investments",
    "business": "business",
    "franchise": "franchise",
    "startup": "startup",
    "investments": "investments",
};

export interface FiltersState {
    category_id?: number;
    city: string;
    stage: string;
    paybackPeriod: string;
    priceMin: string;
    priceMax: string;
    areaFrom: string;
    areaTo: string;
    investmentMin: string;
    investmentMax: string;
    profitabilityMin: string;
    profitabilityMax: string;
    listing_type?: "buy" | "sell" | "" | null;
    categorySlug?: string;
    offer_type: "business" | "startup" | "franchise" | "investments" | "" | null;
}
export interface FileMeta {
    name: string;
    size: number;
    type: string;
}
export const categoryTitleMap = {
  business: { ru: "Бизнес", uz: "Biznes" },
  franchise: { ru: "Франшизы", uz: "Fransiyalar" },
  startup: { ru: "Стартапы", uz: "Startaplar" },
  investments: { ru: "Инвестиции", uz: "Investitsiyalar" },
};