import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: 'home' | 'gallery' | 'collaboration' | 'about') => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navigationItems = [
    { id: 'home', label: t('nav.home'), page: 'home' as const },
    { id: 'gallery', label: t('nav.gallery'), page: 'gallery' as const },
    { id: 'collaboration', label: t('nav.collaboration'), page: 'collaboration' as const },
   
    { id: 'about', label: t('nav.about'), page: 'about' as const }
  ];

  const languages = [
    { code: 'tm', name: 'Türkmen' },
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' }
  ];

  const handleNavigation = (page: 'home' | 'gallery' | 'collaboration' | 'about') => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <div className="max-w-5xl mx-auto glassmorphism-header border border-white/20 rounded-full px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavigation('home')}
            className="flex items-center group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg"
          >
            <img 
              src="/Images/logo.png" 
              alt="Abadan Haly Logo" 
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center space-x-1 flex-1 mx-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.page)}
                className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-180 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  currentPage === item.page
                    ? 'text-emerald-800 bg-white/50 shadow-sm'
                    : 'text-gray-700 hover:text-emerald-800 hover:bg-white/30'
                }`}
                aria-current={currentPage === item.page ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-emerald-800 transition-colors px-3 py-2 rounded-xl hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                aria-expanded={isLangOpen}
                aria-haspopup="true"
                aria-label="Select language"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">
                  {language}
                </span>
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 glassmorphism-dropdown rounded-2xl shadow-lg py-2 z-20" role="menu" aria-orientation="vertical">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-white/20 transition-colors focus:outline-none focus:bg-white/20 ${
                        language === lang.code ? 'text-emerald-800 font-medium' : 'text-gray-700'
                      }`}
                      role="menuitem"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-emerald-800 hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-2 glassmorphism-dropdown rounded-xl shadow-lg mx-4">
          <div className="px-4 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.page)}
                  className={`block w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    currentPage === item.page
                      ? 'text-emerald-800 bg-white/40'
                      : 'text-gray-700 hover:text-emerald-800 hover:bg-white/30'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Language Switcher */}
              <div className="pt-3 border-t border-white/20">
                <div className="flex space-x-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setIsMenuOpen(false);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        language === lang.code 
                          ? 'text-emerald-800 bg-white/40' 
                          : 'text-gray-700 hover:text-emerald-800 hover:bg-white/30'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}