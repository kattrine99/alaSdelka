import React, { createContext, useContext, useEffect, useState } from "react";
import translations from "../ru_uz_translation.json";

type LangType = "ru" | "uz" | "en";

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
        if (urlLang === "ru" || urlLang === "uz" || urlLang === "en") {
            setLang(urlLang);
        } else {
            setLang("ru");
        }
    }, []);

    const t = (text: string) => {
        const translation = (translations as Record<string, string | { ru: string; uz: string; en: string }>)[text];
        
        if (!translation) {
            return text;
        }
        
        // Если перевод - объект с тремя языками
        if (typeof translation === "object" && "ru" in translation && "uz" in translation && "en" in translation) {
            return translation[lang] || translation.ru || text;
        }
        
        // Если перевод - строка (старый формат для обратной совместимости)
        if (typeof translation === "string") {
            if (lang === "uz") {
                return translation;
            } else if (lang === "en") {
                // Для английского пока возвращаем русский текст как fallback
                return text;
            }
            return text;
        }
        
        return text;
    };

    return (
        <TranslationContext.Provider value={{ lang, setLang, t }}>
            {children}
        </TranslationContext.Provider>
    );
};
