import { ICard } from "../components/Cards/Cards";

export const titleToTypeMap: Record<string, ICard["type"]> = {
    "Бизнес": "бизнес",
    "Франшиза": "франшиза",
    "Стартапы": "стартап",
    "Стартап": "стартап",
    "Инвестиции": "инвестиции",
};

export const typeToTitleMap: Record<ICard["type"], string> = {
    "бизнес": "Бизнес",
    "франшиза": "Франшиза",
    "стартап": "Стартапы",
    "инвестиции": "Инвестиции",
};
export const urlToTypeMap: Record<string, ICard["type"]> = {
    business: "бизнес",
    franchise: "франшиза",
    startup: "стартап",
    startups: "стартап",
    investments: "инвестиции",
};