
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import ModSection from './components/ModSection';
import InstallSection from './components/InstallSection';
import ServerStatus from './components/ServerStatus';
import TicketsSection from './components/TicketsSection';
import TicketsAdmin from './components/Admin/TicketsAdmin';
import Footer from './components/Footer';
import ChatOverlay from './components/ChatOverlay';
import AllMods from './components/AllMods';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showFAB, setShowFAB] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const path = typeof window !== 'undefined' ? window.location.pathname : '/';

  useEffect(() => {
    const checkAtBottom = () => {
      const threshold = 50; // px from bottom to consider "at bottom"
      const scrolledFromTop = window.scrollY + window.innerHeight;
      const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      if (scrolledFromTop >= docHeight - threshold) {
        setShowFAB(false);
      } else {
        setShowFAB(true);
      }
    };

    checkAtBottom();
    window.addEventListener('scroll', checkAtBottom, { passive: true });
    window.addEventListener('resize', checkAtBottom);
    return () => {
      window.removeEventListener('scroll', checkAtBottom);
      window.removeEventListener('resize', checkAtBottom);
    };
  }, []);

  return (
    <div className="min-h-screen selection:bg-primary selection:text-black">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

      <main className="pt-24">
        {path === '/admin' ? (
          <TicketsAdmin />
        ) : path === '/mods' ? (
          <AllMods />
        ) : (
          <>
            <Hero />
            <Marquee />
            <ModSection />
            <InstallSection />
            <ServerStatus />
            <TicketsSection />
          </>
        )}
      </main>

      <Footer />

      {/* Floating Action Button: abrir sección de tickets */}
      <button
        onClick={() => {
          const el = document.getElementById('tickets');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        aria-label="Abrir ticket"
        className={`fixed bottom-6 sm:bottom-8 right-4 sm:right-8 z-50 bg-primary text-black rounded-full shadow-2xl flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 hover:scale-110 active:scale-95 transition-all group ${
          showFAB ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <span className="material-icons-outlined text-2xl">task_alt</span>
        <span className="font-black uppercase text-sm inline-block">Abrir ticket</span>
      </button>

      {showChat && <ChatOverlay onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default App;
