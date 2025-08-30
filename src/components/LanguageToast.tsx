import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Globe } from 'lucide-react';
import { DEFAULT_LOCALE } from '../i18n';

export default function LanguageToast() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [language, setLanguage] = useState<string>('');

  useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      setLanguage(event.detail.language);
      setIsVisible(true);
    };

    window.addEventListener('showLanguageToast', handleShowToast as EventListener);
    
    return () => {
      window.removeEventListener('showLanguageToast', handleShowToast as EventListener);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Globe className="w-5 h-5 text-[#0F3B2F]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700">
            {t('language.selected')}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
