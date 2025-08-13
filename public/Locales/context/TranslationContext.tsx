import React, { createContext, useContext, useEffect, useState } from "react";
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

    useEffect(() => {
        const urlLang = window.location.pathname.split("/")[1] as LangType;
        if (urlLang === "ru" || urlLang === "uz") {
            setLang(urlLang);
        } else {
            setLang("ru");
        }
    }, []);

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
