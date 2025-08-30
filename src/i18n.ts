import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Supported locales
export const SUPPORTED_LOCALES = ['tk', 'ru', 'en', 'de'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

// Default locale
export const DEFAULT_LOCALE: SupportedLocale = 'tk';

// Get language from cookie or browser
const getInitialLanguage = (): SupportedLocale => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  // Check cookie first
  const cookieLang = document.cookie
    .split('; ')
    .find(row => row.startsWith('lang='))
    ?.split('=')[1] as SupportedLocale;
  
  if (cookieLang && SUPPORTED_LOCALES.includes(cookieLang)) {
    return cookieLang;
  }

  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'ru' && SUPPORTED_LOCALES.includes('ru')) {
    return 'ru';
  }
  if (browserLang === 'en' && SUPPORTED_LOCALES.includes('en')) {
    return 'en';
  }
  if (browserLang === 'de' && SUPPORTED_LOCALES.includes('de')) {
    return 'de';
  }

  // Default to Turkmen
  return DEFAULT_LOCALE;
};

// Set language cookie
export const setLanguageCookie = (lang: SupportedLocale) => {
  document.cookie = `lang=${lang}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
};

// Initialize i18n
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES,
    lng: getInitialLanguage(),
    
    // Backend configuration
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    
    // Detection configuration
    detection: {
      order: ['cookie', 'navigator'],
      lookupCookie: 'lang',
      caches: ['cookie'],
    },
    
    // Interpolation
    interpolation: {
      escapeValue: false,
    },
    
    // React configuration
    react: {
      useSuspense: false,
    },
    
    // Debug mode (disable in production)
    debug: false,
  });

// Set initial language cookie if not present (only after DOM is ready)
if (typeof window !== 'undefined') {
  const currentLang = i18n.language as SupportedLocale;
  if (!document.cookie.includes('lang=')) {
    setLanguageCookie(currentLang);
    
    // Show language selection toast for first-time visitors
    if (currentLang === DEFAULT_LOCALE) {
      setTimeout(() => {
        const event = new CustomEvent('showLanguageToast', {
          detail: { language: currentLang }
        });
        window.dispatchEvent(event);
      }, 1000);
    }
  }
}

export default i18n;
