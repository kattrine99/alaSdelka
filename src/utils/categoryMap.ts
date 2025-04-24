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



export const typeToTitleMap: Record<ICard["type"], string> = {
    "бизнес": "Бизнес",
    "франшиза": "Франшиза",
    "стартап": "Стартапы",
    "инвестиции": "Инвестиции",
    business: "",
    franchise: "",
    startup: "",
    investments: ""
};
export const urlToTypeMap: Record<string, ICard["type"]> = {
    business: "бизнес",
    franchise: "франшиза",
    startup: "стартап",
    startups: "стартап",
    investments: "инвестиции",
};
export const typeToUrlMap: Record<ICard["type"], string> = {
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

export const urlToApiOfferTypeMap: Record<string, ICard["type"]> = {
    "бизнес": "business",
    "франшиза": "franchise",
    "стартап": "startup",
    "инвестиции": "investments",
};