
import React from 'react';

interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleTheme, isDarkMode }) => {
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
        <div className="flex items-center gap-2 text-[10px] md:text-xs font-black px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full whitespace-nowrap">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          SERVER ABIERTO
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
