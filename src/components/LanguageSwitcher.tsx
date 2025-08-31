import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { SUPPORTED_LOCALES, type SupportedLocale, setLanguageCookie } from '../i18n';

const LANGUAGE_CODES: Record<SupportedLocale, string> = {
  tk: 'TKM',
  ru: 'RU',
  en: 'EN',
  de: 'DEU'
};

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLang = i18n.language as SupportedLocale;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: SupportedLocale) => {
    if (lang === currentLang) {
      setIsOpen(false);
      return;
    }

    // Set cookie
    setLanguageCookie(lang);
    
    // Change language
    i18n.changeLanguage(lang);
    
    // Update URL with new locale prefix
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(tk|ru|en|de)/, '') || '/';
    const newPath = `/${lang}${pathWithoutLocale}`;
    
    // Update URL without page reload
    window.history.pushState({}, '', newPath);
    
    // Close dropdown
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-180 focus:outline-none focus:ring-2 focus:ring-[#0F3B2F] focus:ring-opacity-50"
        aria-label={t('language.change')}
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-bold text-gray-700">
          {LANGUAGE_CODES[currentLang]}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-180 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[80px] z-50">
          {SUPPORTED_LOCALES.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`w-full flex items-center justify-center px-3 py-2 text-sm font-bold hover:bg-gray-50 transition-colors duration-180 ${
                lang === currentLang ? 'bg-[#0F3B2F] text-white hover:bg-[#0F3B2F]/90' : 'text-gray-700'
              }`}
            >
              {LANGUAGE_CODES[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
