import { ICard } from "../components/Cards/Interfaces";

export const titleToTypeMap: Record<string, ICard["type"]> = {
    "Бизнес": "бизнес",
    "Франшиза": "франшиза",
    "Стартапы": "стартап",
    "Стартап": "стартап",
    "Инвестиции": "инвестиции",
    business: "бизнес",
    franchise: "франшиза",
    startup: "стартап",
    startups: "стартап",
    investments: "инвестиции",
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
export const typeToUrlMap: Record<ICard["type"], string> = {
    "бизнес": "business",
    "франшиза": "franchise",
    "стартап": "startup",
    "инвестиции": "investments",
  };
  