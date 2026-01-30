
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleTheme, isDarkMode }) => {
  const [online, setOnline] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    // Lock body scroll when mobile menu is open
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      // Focus the first link for accessibility
      setTimeout(() => { firstLinkRef.current?.focus(); }, 50);
    }
  }, [menuOpen]);

  useEffect(() => {
    const SERVER_HOST = (import.meta as any).env?.VITE_SERVER_HOST || '';
    if (!SERVER_HOST) return;

    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(SERVER_HOST)}`);
        const data = await res.json();
        if (!cancelled) setOnline(Boolean(data.online));
      } catch (e) {
        if (!cancelled) setOnline(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center bg-bg-light/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 transition-all">
      <a href="/" className={`flex items-center gap-2 group transition-opacity duration-200 ${menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
          <span className="material-icons-outlined text-black scale-75">grid_view</span>
        </div>
        <span className="font-display font-black text-xl tracking-tighter uppercase">GitanoMongoloMon</span>
      </a>

      <div className="hidden lg:flex gap-12 font-medium text-xs uppercase tracking-widest opacity-80">
        <a href="/#home" className="hover:text-primary transition-colors">Inicio</a>
        <a href="/#mods" className="hover:text-primary transition-colors">Mods</a>
        <a href="/#install" className="hover:text-primary transition-colors">Instalación</a>
        <a href="/#server" className="hover:text-primary transition-colors">Servidor</a>
        <a href="/#tickets" className="hover:text-primary transition-colors">Tickets</a>
      </div>

      {/* Mobile menu button */}
      <button
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen((s) => !s)}
        className="lg:hidden p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <span className="material-icons-outlined">{menuOpen ? 'close' : 'menu'}</span>
      </button>

      <div className="hidden md:flex items-center gap-4">
        <div className={`flex items-center gap-2 text-[10px] md:text-xs font-black px-4 py-2 rounded-full whitespace-nowrap ${online ? 'bg-black dark:bg-white text-white dark:text-black' : online === false ? 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300' : 'bg-black dark:bg-white text-white dark:text-black'}`}>
          <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-400 animate-pulse' : online === false ? 'bg-red-500' : 'bg-yellow-400 animate-pulse'}`}></span>
          {online ? 'SERVER ABIERTO' : online === false ? 'SERVER CERRADO' : 'SERVER —'}
        </div>
      </div>

      {/* Mobile menu overlay rendered via portal to avoid stacking issues */}
      {menuOpen && createPortal(
        <div
          id="mobile-menu"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-bg-light dark:bg-bg-dark flex flex-col items-center justify-start pt-28 px-6 lg:hidden"
          onClick={(e) => { if (e.target === overlayRef.current) setMenuOpen(false); }}
        >
          <button
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
          >
            <span className="material-icons-outlined">close</span>
          </button>
          {/* Server status shown inside mobile overlay */}
          <div className="w-full flex justify-center mt-4 mb-4">
            <div className={`flex items-center gap-2 text-[10px] font-black px-4 py-2 rounded-full whitespace-nowrap ${online ? 'bg-black dark:bg-white text-white dark:text-black' : online === false ? 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300' : 'bg-black dark:bg-white text-white dark:text-black'}`}>
              <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-400 animate-pulse' : online === false ? 'bg-red-500' : 'bg-yellow-400 animate-pulse'}`}></span>
              {online ? 'SERVER ABIERTO' : online === false ? 'SERVER CERRADO' : 'SERVER —'}
            </div>
          </div>
          <nav className="flex flex-col items-center gap-6 text-xl uppercase font-bold tracking-wider w-full mt-6">
            <a ref={firstLinkRef} href="/#home" onClick={() => setMenuOpen(false)} className="hover:text-primary">Inicio</a>
            <a href="/#mods" onClick={() => setMenuOpen(false)} className="hover:text-primary">Mods</a>
            <a href="/#install" onClick={() => setMenuOpen(false)} className="hover:text-primary">Instalación</a>
            <a href="/#server" onClick={() => setMenuOpen(false)} className="hover:text-primary">Servidor</a>
            <a href="/#tickets" onClick={() => setMenuOpen(false)} className="hover:text-primary">Tickets</a>
          </nav>
        </div>,
        document.body
      )}
    </nav>
  );
};

export default Navbar;
