
import React, { useState, useEffect } from 'react';

interface Player {
  id: string;
  name: string;
  avatar: string;
}

const ServerStatus: React.FC = () => {
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [maxPlayers, setMaxPlayers] = useState<number | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState<boolean | null>(null);
  const SERVER_HOST = (import.meta as any).env?.VITE_SERVER_HOST || '23.88.73.21:26211';

  // Simulate fetching data from a real-time server API
  useEffect(() => {
    // use outer SERVER_HOST (falls back to the provided IP)

    const fetchServerData = async () => {
      if (!SERVER_HOST) {
        // Keep a mocked state when no host is provided
        const mockNames = ['Steve', 'Alex', 'Herobrine', 'Notch', 'Techno', 'Dream', 'Mon', 'Gitano', 'Mongolo'];
        const mockPlayers = Array.from({ length: 12 }).map((_, i) => ({
          id: Math.random().toString(36).substr(2, 9),
          name: mockNames[i % mockNames.length] + (i > 6 ? i : ''),
          avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${i + 10}&backgroundColor=b6e3f4`
        }));

        setPlayers(mockPlayers);
        setPlayerCount(mockPlayers.length);
        setMaxPlayers(100);
        setOnline(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(SERVER_HOST)}`);
        const data = await res.json();

        setOnline(Boolean(data.online));
        setVersion(data.version ?? data.software ?? null);
        if (data.online) {
          setPlayerCount(data.players?.online ?? 0);
          setMaxPlayers(data.players?.max ?? null);

          const list = (data.players?.list || []).slice(0, 100).map((name: string, i: number) => ({
            id: `${i}-${name}`,
            name,
            // Use Minotar helm endpoint to fetch the head/face of the skin (better for faces)
            avatar: `https://minotar.net/helm/${encodeURIComponent(name)}/100.png`
          }));
          setPlayers(list);

        } else {
          setPlayerCount(0);
          setMaxPlayers(null);
          setPlayers([]);
        }
      } catch (err) {
        console.error('Failed to fetch server status', err);
        setOnline(false);
        setPlayerCount(null);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServerData();
    const interval = setInterval(fetchServerData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="server" className="py-32 px-6 md:px-16 bg-bg-light dark:bg-bg-dark border-t border-black/5 dark:border-white/5 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-primary mb-4 block">Telemetría en tiempo real</span>
              <h2 className="hero-title text-7xl md:text-9xl font-black lowercase dark:text-white">
              estado<br/>del servidor
            </h2>
          </div>
            <div className="w-full flex items-center justify-between gap-4 md:gap-8 bg-black dark:bg-white p-4 md:p-2 rounded-[2rem]">
              <div className="flex-1 px-6 py-6 md:px-8 md:py-6 rounded-[1.5rem] bg-stone-gray/10 dark:bg-black/5 flex flex-col justify-center">
                <span className="text-sm md:text-[10px] uppercase font-black opacity-40 text-white dark:text-black">Jugadores</span>
                <span className={`text-5xl md:text-6xl font-display font-black ${online ? 'text-primary' : 'text-red-400'}`}>
                  {loading ? '—' : online ? `${playerCount ?? 0}/${maxPlayers ?? '—'}` : 'Offline'}
                </span>
              </div>
              <div className="flex items-center gap-3 px-4">
                <div className={`w-4 h-4 rounded-full ${online ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <div className="text-base md:text-sm font-black uppercase text-white/90">{online ? 'En línea' : online === false ? 'Desconectado' : '—'}</div>
              </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-stone-gray/10 p-8 rounded-[3rem] border border-black/5 dark:border-white/5 flex flex-col justify-between">
            <div>
              <h4 className="text-2xl font-black mb-4">Información principal</h4>
              <ul className="space-y-4 text-sm font-medium opacity-60">
                <li className="flex justify-between"><span>Versión</span> <span>{version ?? '—'}</span></li>
                <li className="flex justify-between"><span>Región</span> <span>Europa</span></li>
                <li className="flex justify-between"><span>Dificultad</span> <span>Difícil</span></li>
              </ul>
            </div>
            <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xl uppercase font-black tracking-widest">IP: {SERVER_HOST}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-stone-gray/10 p-8 rounded-[3rem] border border-black/5 dark:border-white/5 overflow-hidden">
            <h4 className="text-2xl font-black mb-8">Usuarios activos</h4>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 animate-pulse">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="aspect-square bg-black/5 dark:bg-white/5 rounded-2xl"></div>
                ))}
              </div>
            ) : players.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-center text-sm opacity-70">
                No hay jugadores
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-4 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                {players.map((player) => (
                  <div key={player.id} className="flex flex-col items-center gap-2 min-w-0 px-1">
                    <div className="w-14 h-14 sm:w-16 md:w-20 rounded-2xl overflow-hidden p-0 bg-transparent flex items-center justify-center">
                      <img
                        src={player.avatar}
                        alt={player.name || 'avatar'}
                        title={player.name || 'Anónimo'}
                        className="w-full h-full object-contain object-center block"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          const img = e.currentTarget;
                          const src = img.src || '';
                          // fallback chain: helm -> avatar -> dicebear
                          if (src.includes('/helm/')) {
                            img.src = `https://minotar.net/avatar/${encodeURIComponent(player.name || 'anon')}/100.png`;
                            return;
                          }
                          if (src.includes('/avatar/')) {
                            img.src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(player.name || 'anon')}&backgroundColor=b6e3f4`;
                            return;
                          }
                          img.src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(player.name || 'anon')}&backgroundColor=b6e3f4`;
                        }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-center text-black dark:text-white w-full break-words whitespace-normal" title={player.name || 'Anónimo'}>
                      {player.name || 'Anónimo'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServerStatus;
