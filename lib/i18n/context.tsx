"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

type Language = "en" | "es";

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Get initial language from localStorage or default to 'en'
const getInitialLanguage = (): Language => {
    if (typeof window !== "undefined") {
        const savedLanguage = localStorage.getItem("language");
        if (savedLanguage === "en" || savedLanguage === "es") {
            return savedLanguage;
        }
    }
    return "en";
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>(getInitialLanguage);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        if (typeof window !== "undefined") {
            localStorage.setItem("language", lang);
        }
    };

    const t = (key: string): string => {
        const keys = key.split(".");
        let value: any = translations[language];

        for (const k of keys) {
            if (value && typeof value === "object" && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        return value as string;
    };

    // Effect to handle system language preference
    useEffect(() => {
        const savedLanguage = localStorage.getItem("language");
        if (!savedLanguage) {
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith("es")) {
                setLanguage("es");
            }
        }
    }, []);

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error("useI18n must be used within an I18nProvider");
    }
    return context;
}
