
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-bg-light dark:bg-bg-dark py-16 px-6 md:px-16 border-t border-black/5 dark:border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-2xl tracking-tighter uppercase">GitanoMongoloMon</span>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
        </div>

        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest text-center md:text-right">
          © 2026 Kono Studio
        </p>
      </div>
    </footer>
  );
};

export default Footer;
