export type SupportedLanguage = 'sr' | 'en' | 'de';

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, string> = {
  sr: 'Serbian',
  en: 'English',
  de: 'Deutsch',
};

export const LIBRETRANSLATE_LANG_MAP: Record<SupportedLanguage, string> = {
  sr: 'sr',
  en: 'en',
  de: 'de',
};

export type TranslationStatus = 'ok' | 'limit_reached' | 'error' | 'loading';
