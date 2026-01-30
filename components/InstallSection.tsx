
import React from 'react';
import Paso3 from '../imgs/Paso_3.png';
import Paso4 from '../imgs/Paso_4.png';
import Paso5 from '../imgs/Paso_5.png';

const InstallSection: React.FC = () => {
  return (
    <section id="install" className="bg-black text-white py-40 px-6 md:px-16 relative overflow-hidden scroll-mt-20">
      {/* Brutalist accents */}
      <div className="absolute top-12 left-12 w-16 h-16 border border-white/20 flex items-center justify-center opacity-30">
        <span className="material-icons-outlined">filter_center_focus</span>
      </div>
      <div className="absolute top-12 right-12 w-16 h-16 border border-white/20 flex items-center justify-center opacity-30">
        <span className="material-icons-outlined">filter_center_focus</span>
      </div>

      <div className="max-w-7xl mx-auto">
        <h2 className="hero-title text-[10vw] font-black lowercase mb-32 text-center text-white/95">
          cómo instalar
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-white/10 py-12">
          <div className="group bg-white/5 p-6 rounded-3xl hover:bg-white/6 transition-colors">
            <img src="https://cdn1.epicgames.com/offer/cb2ddeca5ecb4ced9ebd3a68f22e5fdf/EGS_CurseForge_Overwolf_S1_2560x1440-b6eada8fa25137bfd79bce9cccb41c1e" alt="Paso 1 - CurseForge" className="w-full h-80 md:h-72 object-cover rounded-2xl mb-6" />
            <span className="inline-block px-4 py-1.5 bg-white text-black text-[10px] font-black rounded-full mb-4">PASO 1</span>
            <h4 className="text-2xl font-bold mb-3">Tener instalado CurseForge</h4>
            <p className="text-white/60 text-lg leading-relaxed">Instala CurseForge para gestionar modpacks y perfiles.</p>
            <a
              href="https://download.overwolf.com/install/Download?ExtensionId=cfiahnpaolfnlgaihhmobmnjdafknjnjdpdabpcm&utm_term=eyJkb21haW4iOiJjZi13ZWIifQ%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-3 bg-primary text-black font-black rounded-2xl hover:scale-105 transition-transform"
            >
              Instalar CurseForge
            </a>
          </div>

          <div className="group bg-white/5 p-6 rounded-3xl hover:bg-white/6 transition-colors">
            <img src="https://images.contentstack.io/v3/assets/blt38f1f401b66100ad/blt8e4391f57ad17653/690c19943acaa16c984501b4/winrar-1200.001.png?width=1200&quality=80&format=auto&cache=true&immutable=true&cache-control=max-age%3D31536000" alt="Paso 2 - Descargar paquete" className="w-full h-80 md:h-72 object-cover rounded-2xl mb-6" />
            <span className="inline-block px-4 py-1.5 bg-white text-black text-[10px] font-black rounded-full mb-4">PASO 2</span>
            <h4 className="text-2xl font-bold mb-3">Descargar el paquete</h4>
            <p className="text-white/60 text-lg leading-relaxed mb-4">Descarga el archivo .zip optimizado que contiene todos los mods y configuraciones.</p>
            <a
              href="https://github.com/PabloMego/ModsMon/releases/download/1.0.1/GitanoMongoloMon-1.0.1.zip"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-3 bg-primary text-black font-black rounded-2xl hover:scale-105 transition-transform"
            >
              Descargar paquete (.ZIP)
            </a>
          </div>

          <div className="group bg-white/5 p-6 rounded-3xl hover:bg-white/6 transition-colors">
            <img src={Paso3} alt="Paso 3 - Importar" className="w-full h-80 md:h-72 object-cover rounded-2xl mb-6" />
            <span className="inline-block px-4 py-1.5 bg-white text-black text-[10px] font-black rounded-full mb-4">PASO 3</span>
            <h4 className="text-2xl font-bold mb-3">Abrir CurseForge y darle a Import</h4>
            <p className="text-white/60 text-lg leading-relaxed">Abre CurseForge y selecciona la opción "Importar" para añadir un modpack desde un archivo .zip.</p>
          </div>

          <div className="group bg-white/5 p-6 rounded-3xl hover:bg-white/6 transition-colors">
            <img src={Paso4} alt="Paso 4 - Choose ZIP" className="w-full h-80 md:h-72 object-cover rounded-2xl mb-6" />
            <span className="inline-block px-4 py-1.5 bg-white text-black text-[10px] font-black rounded-full mb-4">PASO 4</span>
            <h4 className="text-2xl font-bold mb-3">Elegir archivo .zip y esperar</h4>
            <p className="text-white/60 text-lg leading-relaxed">Selecciona el archivo .zip descargado y espera a que CurseForge instale todos los mods y dependencias.</p>
          </div>

          <div className="group bg-white/5 p-6 rounded-3xl hover:bg-white/6 transition-colors">
            <img src={Paso5} alt="Paso 5 - Play" className="w-full h-80 md:h-72 object-cover rounded-2xl mb-6" />
            <span className="inline-block px-4 py-1.5 bg-white text-black text-[10px] font-black rounded-full mb-4">PASO 5</span>
            <h4 className="text-2xl font-bold mb-3">Dale a Play</h4>
            <p className="text-white/60 text-lg leading-relaxed">Inicia el perfil importado y pulsa "Play" para ejecutar el juego con el modpack instalado.</p>
          </div>
        </div>
      </div>

      {/* Decorative Audio-like bars */}
      <div className="mt-40 flex justify-center opacity-5 pointer-events-none">
        <div className="flex items-end justify-center gap-4 h-64 overflow-hidden">
          {[32, 48, 64, 40, 56, 32, 44, 60, 48, 36, 52, 64].map((h, i) => (
            <div key={i} className="w-10 bg-white rounded-full" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstallSection;
