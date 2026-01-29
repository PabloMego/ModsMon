
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import ModSection from './components/ModSection';
import InstallSection from './components/InstallSection';
import ServerStatus from './components/ServerStatus';
import TicketsSection from './components/TicketsSection';
import Footer from './components/Footer';
import ChatOverlay from './components/ChatOverlay';
import AllMods from './components/AllMods';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const path = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <div className="min-h-screen selection:bg-primary selection:text-black">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

      <main className="pt-24">
        {path === '/mods' ? (
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
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-primary text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <span className="material-icons-outlined text-3xl group-hover:rotate-12 transition-transform">task_alt</span>
      </button>

      {showChat && <ChatOverlay onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default App;
