
import React from 'react';

const mods = [
  {
    icon: 'pets',
    title: '🥇 Cobblemon',
    image: 'https://i.redd.it/ag4307hy62qe1.jpeg',
    desc: 'El mod estrella, sin discusión. Transformas Minecraft en un mundo Pokémon completo: captura, cría, combates y progresión. Altamente adictivo y muy bien balanceado. Visual y gameplay: simplemente otro juego dentro de Minecraft.'
  },
  {
    icon: 'terrain',
    title: '🥈 Terralith',
    image: 'https://images.squarespace-cdn.com/content/v1/6240c1f3e10b50416d969a84/45c5d625-285c-4477-974e-771012c8e23a/2022-05-27_23.40.23.jpg',
    desc: 'Cambia todo el mundo que conoces. Biomas enormes, naturales, variados y espectaculares. Explorar es un placer constante, perfecto para que Cobblemon tenga un mundo épico donde vivir aventuras.'
  },
  {
    icon: 'music_note',
    title: '🥉 Sound Physics Remastered',
    image: 'https://i.ytimg.com/vi/YHUTAiVoCz8/maxresdefault.jpg',
    desc: 'Da vida y realismo a todo lo demás. Ecos en cuevas, sonidos ambientales y pasos realistas. La inmersión se dispara; explorar y pelear se vuelve mucho más intenso. Junto a Cobblemon y Terralith, el juego se siente completamente nuevo.'
  }
];

const ModSection: React.FC = () => {
  return (
    <section id="mods" className="py-32 px-6 md:px-16 bg-bg-light dark:bg-bg-dark scroll-mt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {mods.map((mod, i) => (
          <div 
            key={i} 
            className="group relative bg-white dark:bg-stone-gray/10 p-6 rounded-[2rem] hover:bg-primary transition-all duration-700 overflow-hidden cursor-default"
          >
            {mod.image && (
              <img src={mod.image} alt={mod.title} className="w-full h-48 object-cover rounded-2xl mb-6" />
            )}
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-4 group-hover:text-black leading-tight">{mod.title}</h3>
              <p className="text-lg text-black/60 dark:text-white/60 group-hover:text-black/80 font-medium">
                {mod.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-12 flex justify-center">
        <a href="/mods" className="px-8 py-4 bg-primary text-black font-black rounded-full uppercase tracking-widest hover:scale-105 transition-transform">
          Ver todos los mods
        </a>
      </div>
    </section>
  );
};

export default ModSection;
