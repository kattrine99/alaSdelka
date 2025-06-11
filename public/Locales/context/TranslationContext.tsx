import React, { createContext, useContext, useState } from "react";
import translations from "../ru_uz_translation.json";

type LangType = "ru" | "uz";

interface ITranslationContext {
    lang: LangType;
    setLang: (lang: LangType) => void;
    t: (text: string) => string;
}

const TranslationContext = createContext<ITranslationContext>({
    lang: "ru",
    setLang: () => { },
    t: (text) => text,
});

export const useTranslation = () => useContext(TranslationContext);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<LangType>("ru");

    const t = (text: string) => {
        if (lang === "uz") {
            return (translations as Record<string, string>)[text] || text;
        }
        return text;
    };

    return (
        <TranslationContext.Provider value={{ lang, setLang, t }}>
            {children}
        </TranslationContext.Provider>
    );
};
