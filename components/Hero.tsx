
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="pt-40 pb-20 px-6 md:px-16 min-h-screen flex flex-col justify-center overflow-hidden scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 z-10">
          <h1 className="hero-title text-[15vw] lg:text-[10vw] font-black lowercase mb-12 dark:text-white select-none">
            gitano<br/>mongolo<br/>mon
          </h1>
          
          <div className="max-w-md mb-12">
            <p className="text-xl md:text-2xl leading-tight text-black/70 dark:text-white/60 font-light">
              Explora un mundo lleno de aventura, criaturas y desafíos gracias a Cobblemon, Cobbleverse y mods exclusivos. Cría y combate tus criaturas, monta bestias, colecciona medallas y descubre biomas y estructuras increíbles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            

            <div className="flex gap-12 border-l border-black/10 dark:border-white/10 pl-8">
              <div>
                <p className="text-4xl md:text-5xl font-black font-display tracking-tighter">+100</p>
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Mods</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-black font-display tracking-tighter">24/7</p>
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Server Abierto</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative mt-12 lg:mt-0">
          <div className="relative w-full aspect-[4/5] bg-primary rounded-[3rem] md:rounded-[5rem] overflow-hidden group shadow-2xl">
            {/* Background Shader effect simulation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent z-10"></div>
            <img 
              alt="Minecraft World" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60 group-hover:scale-105 transition-transform duration-1000"
              src="https://upload.wikimedia.org/wikipedia/commons/1/10/Flag_of_the_Romani_people.svg"
            />
            
            {/* Top-right decorative circle removed */}

            {/* Avatar and quick-install button removed */}

            <div className="absolute top-12 left-12 z-20">
              <svg className="w-32 h-32 text-white/90 fill-current animate-pulse-slow" viewBox="0 0 200 200">
                <path d="M100 0 L115 85 L200 100 L115 115 L100 200 L85 115 L0 100 L85 85 Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
