import { ICard } from "../components/Cards/Interfaces";

export const titleToTypeMap: Record<
    "Бизнес" | "Франшиза" | "Стартапы" | "Инвестиции",
    "business" | "franchise" | "startup" | "investments"
> = {
    "Бизнес": "business",
    "Франшиза": "franchise",
    "Стартапы": "startup",
    "Инвестиции": "investments",
};



export const typeToTitleMap: Record<ICard["offer_type"], string> = {
    "бизнес": "Бизнес",
    "франшиза": "Франшиза",
    "стартап": "Стартапы",
    "инвестиции": "Инвестиции",
    business: "",
    franchise: "",
    startup: "",
    investments: ""
};
export const urlToTypeMap: Record<string, ICard["offer_type"]> = {
    business: "бизнес",
    franchise: "франшиза",
    startup: "стартап",
    startups: "стартап",
    investments: "инвестиции",
};
export const typeToUrlMap: Record<ICard["offer_type"], string> = {
    "бизнес": "business",
    "франшиза": "franchise",
    "стартап": "startup",
    "инвестиции": "investments",
    business: "",
    franchise: "",
    startup: "",
    investments: ""
};

export const profileNavigate = [
    { label: "Мои объявления", to: "/announcements" },
    { label: "Уведомления", to: "/notices" },
    { label: "Избранное", to: "/favorites" },
    { label: "Продвижение", to: "/promotion" },
];

export const urlToApiOfferTypeMap: Record<string, ICard["offer_type"]> = {
    "бизнес": "business",
    "франшиза": "franchise",
    "стартап": "startup",
    "инвестиции": "investments",
};

export const offerTypeToUrlMap: Record<string, string> = {
    "бизнес": "business",
    "франшиза": "franchise",
    "стартап": "startup",
    "инвестиции": "investments",
    "business": "business",
    "franchise": "franchise",
    "startup": "startup",
    "investments": "investments"
};
export const ruToApiOfferTypeMap = {
    бизнес: "business",
    стартап: "startup",
    франшиза: "franchise",
    инвестиции: "investments",
} as const;
