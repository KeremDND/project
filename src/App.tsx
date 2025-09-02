import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import LanguageToast from './components/LanguageToast';

// Lazy load components
const Hero = lazy(() => import('./components/Hero'));
const Gallery = lazy(() => import('./components/Gallery'));
const Collaboration = lazy(() => import('./components/Collaboration'));
const About = lazy(() => import('./components/About'));

type Page = 'home' | 'gallery' | 'collaboration' | 'about' | 'shop' | 'product' | 'support' | 'certificates';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const skipToMain = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  };

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/') setCurrentPage('home');
      else if (path === '/gallery') setCurrentPage('gallery');
      else if (path === '/collaboration') setCurrentPage('collaboration');
      else if (path === '/about') setCurrentPage('about');
      // Scroll to top when using browser back/forward
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    const path = page === 'home' ? '/' : `/${page}`;
    window.history.pushState({}, '', path);
    // Scroll to top when navigating to a new page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Hero onNavigate={navigate} />
          </Suspense>
        );
      case 'gallery':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Gallery />
          </Suspense>
        );
      case 'collaboration':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Collaboration />
          </Suspense>
        );

      case 'about':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <About onNavigate={navigate} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Hero onNavigate={navigate} />
          </Suspense>
        );
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <a href="#main-content" className="skip-link" onClick={skipToMain}>
          Skip to main content
        </a>
        <Header currentPage={currentPage} onNavigate={navigate} />
        <main id="main-content" tabIndex={-1}>
          {renderPage()}
        </main>
                       <Footer onNavigate={navigate} />
               <LanguageToast />
               <Analytics />
               <SpeedInsights />
      </div>
    </AuthProvider>
  );
}

export default App;