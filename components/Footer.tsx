
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-bg-light dark:bg-bg-dark py-16 px-6 md:px-16 border-t border-black/5 dark:border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
        <div className="flex items-center gap-2 justify-start md:justify-start">
          <span className="font-display font-black text-2xl tracking-tighter uppercase">GitanoMongoloMon</span>
        </div>

        <div className="text-center">
          <a href="/admin" aria-label="Iniciar sesión panel admin" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90 text-black dark:text-white hover:underline">
            Iniciar sesión panel admin
          </a>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">© 2026 Kono Studio</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
