import { useCallback } from 'react';
import { translations } from '@/lib/i18n/translations';

type TranslationKey = string;

export function useI18n() {
  // Por padrão, usamos inglês
  const locale = 'en';

  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>) => {
    // Divide a chave por pontos para acessar objetos aninhados
    const keys = key.split('.');
    let translation: any = translations[locale];
    
    // Navega através do objeto de traduções
    for (const k of keys) {
      if (!translation[k]) {
        // Se a tradução não for encontrada, retorna a chave
        return key;
      }
      translation = translation[k];
    }
    
    // Se a tradução for uma string e temos parâmetros, substitui os placeholders
    if (typeof translation === 'string' && params) {
      return Object.entries(params).reduce(
        (str, [param, value]) => str.replace(`{{${param}}}`, String(value)),
        translation
      );
    }
    
    return translation;
  }, [locale]);

  return { t };
}