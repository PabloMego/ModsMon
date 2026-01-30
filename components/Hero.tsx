
import React, { useEffect, useRef, useState } from 'react';
import heroImg from '../imgs/Img_Hero.jpg';

const Hero: React.FC = () => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [soundActive, setSoundActive] = useState(false);

  useEffect(() => {
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = () => setApiReady(true);
    } else {
      setApiReady(true);
    }
  }, []);

  useEffect(() => {
    if (apiReady && containerRef.current && !playerRef.current) {
        playerRef.current = new (window as any).YT.Player(containerRef.current, {
        height: '100%',
        width: '100%',
        videoId: 'k33Hc3FNbso',
        playerVars: {
          autoplay: 1,
          mute: 1,
          rel: 0,
          controls: 1,       // show YouTube player controls (play/pause/seek)
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          iv_load_policy: 3, // disable video annotations
          disablekb: 0,      // enable keyboard controls
          fs: 1,             // allow fullscreen
          loop: 1,           // loop playback
          playlist: 'k33Hc3FNbso', // required for loop to work with single video
        },
        events: {
          onReady: (e: any) => {
            try { e.target.playVideo(); } catch (err) {}
          }
        }
      });
    }
  }, [apiReady]);

  const enableSound = () => {
    if (playerRef.current) {
      try {
        playerRef.current.unMute();
        playerRef.current.playVideo();
        setSoundActive(true);
      } catch (err) {}
    }
  };

  return (
    <>
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
          <div className="w-full bg-transparent rounded-[3rem] md:rounded-[5rem] overflow-hidden group shadow-2xl flex justify-center items-center">
            <img
              alt="Minecraft World"
              className="w-full h-auto object-contain transition-all duration-300 block"
              src={heroImg}
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

    {/* Video promocional debajo del hero */}
    <section className="w-full px-6 md:px-16 py-12 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-center text-2xl md:text-3xl font-semibold mb-6 text-black/80 dark:text-white/80">Video promocional</h3>
        <div className="relative w-full" style={{paddingBottom: '56.25%'}}>
          {/* Contenedor para el player controlable por la API de YouTube */}
          <div
            ref={containerRef as any}
            className="absolute top-0 left-0 w-full h-full rounded-xl shadow-xl overflow-hidden bg-black"
          />

          {/* Botón para activar sonido (necesario porque navegadores bloquean autoplay con audio) */}
          {!soundActive && (
            <button
              onClick={enableSound}
              className="absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-black/85 text-black dark:text-white px-6 py-3 rounded-full shadow-lg"
            >
              Reproducir con sonido
            </button>
          )}
        </div>
      </div>
    </section>
    </>
  );
};

export default Hero;
