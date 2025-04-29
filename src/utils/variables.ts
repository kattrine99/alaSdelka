export const categories = [
    { label: "Бизнес", to: "/business" },
    { label: "Франшиза", to: "/franchise" },
    { label: "Стартапы", to: "/startup" },
    { label: "Инвестиции", to: "/investments" },
];

export const personalpages = [
    { label: "Мои объявления", to: "/announcement" },
    { label: "Уведомления", to: "/notices" },
    { label: "Избранное", to: "/favorites" },
    { label: "Продвижение", to: "/promotion" },
]

export interface FiltersState {
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
  }
  
