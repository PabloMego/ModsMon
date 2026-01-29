
import React from 'react';

const Marquee: React.FC = () => {
  return (
    <div className="bg-black py-12 overflow-hidden border-y border-white/10 select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-white text-7xl md:text-[10rem] font-black font-display opacity-10 uppercase tracking-tighter px-8">
            Mods Destacados.
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
