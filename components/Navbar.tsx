
import React, { useEffect, useState } from 'react';

interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleTheme, isDarkMode }) => {
  const [online, setOnline] = useState<boolean | null>(null);

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
      <a href="/" className="flex items-center gap-2 group">
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

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 text-[10px] md:text-xs font-black px-4 py-2 rounded-full whitespace-nowrap ${online ? 'bg-black dark:bg-white text-white dark:text-black' : online === false ? 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300' : 'bg-black dark:bg-white text-white dark:text-black'}`}>
          <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-400 animate-pulse' : online === false ? 'bg-red-500' : 'bg-yellow-400 animate-pulse'}`}></span>
          {online ? 'SERVER ABIERTO' : online === false ? 'SERVER CERRADO' : 'SERVER —'}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
