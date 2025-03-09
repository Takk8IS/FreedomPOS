"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";

export function LanguageSwitcher() {
    const { language, setLanguage } = useI18n();

    return (
        <div className="flex items-center gap-2">
            <Button
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                className="w-12"
                onClick={() => setLanguage("en")}
            >
                EN
            </Button>
            <Button
                variant={language === "es" ? "default" : "outline"}
                size="sm"
                className="w-12"
                onClick={() => setLanguage("es")}
            >
                ES
            </Button>
        </div>
    );
}
