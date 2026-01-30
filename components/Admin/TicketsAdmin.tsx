import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

interface Ticket {
  id: number;
  category: string;
  discord_tag: string;
  description: string;
  status: string;
  attachment_urls?: string[] | null;
  created_at: string;
}

const TicketsAdmin: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [filter, setFilter] = useState<'all'|'open'|'resolved'|'archived'>('all');
  const ADMIN_PASS = (import.meta as any).env?.VITE_ADMIN_PASSWORD || '';
  const STORAGE_KEY = 'gmm_admin_auth';

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setAuthenticated(stored === '1');
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching tickets', error);
    } else {
      setTickets(data as Ticket[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authenticated) return;
    fetchTickets();
    const interval = setInterval(fetchTickets, 15000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const updateStatus = async (t: Ticket, newStatus: string) => {
    const { error } = await supabase.from('tickets').update({ status: newStatus }).eq('id', t.id);
    if (error) {
      console.error('Error updating ticket', error);
    } else {
      setTickets((prev) => prev.map(p => p.id === t.id ? { ...p, status: newStatus } : p));
    }
  };

  const confirmArchive = async (t: Ticket) => {
    if (!confirm('¿Archivar este ticket? Esta acción lo ocultará del listado principal.')) return;
    await updateStatus(t, 'archived');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ADMIN_PASS) {
      alert('VITE_ADMIN_PASSWORD no está configurada en .env.local');
      return;
    }
    if (passwordInput === ADMIN_PASS) {
      localStorage.setItem(STORAGE_KEY, '1');
      setAuthenticated(true);
      setPasswordInput('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthenticated(false);
  };

  if (!authenticated) {
    return (
      <div className="p-8 bg-white dark:bg-bg-dark rounded-2xl border border-black/5 dark:border-white/5 max-w-md mx-auto">
        <h3 className="text-2xl font-black mb-6">Acceso Admin</h3>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full px-4 py-3 rounded-lg border" />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-black text-white rounded-md">Entrar</button>
            <button type="button" onClick={() => { setPasswordInput(''); }} className="px-4 py-2 border rounded-md">Limpiar</button>
          </div>
          {!ADMIN_PASS && (
            <div className="text-sm text-yellow-700">Nota: VITE_ADMIN_PASSWORD no está configurada; establece la variable en `.env.local`.</div>
          )}
        </form>
      </div>
    );
  }

  const filtered = tickets.filter(t => {
    // 'Todos' ahora excluye los archivados y los resueltos para mayor claridad
    if (filter === 'all') return t.status !== 'archived' && t.status !== 'resolved';
    if (filter === 'open') return t.status === 'open';
    if (filter === 'resolved') return t.status === 'resolved';
    if (filter === 'archived') return t.status === 'archived';
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10 mt-8 mb-12 bg-white dark:bg-bg-dark rounded-2xl border border-black/5 dark:border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
        <h3 className="text-3xl md:text-4xl font-black">Panel de Tickets (Admin)</h3>
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 w-full sm:w-auto md:ml-4">
          <div className="flex gap-2 bg-gray-50 dark:bg-gray-800 p-1 rounded-full overflow-x-auto whitespace-nowrap no-scrollbar justify-center sm:justify-start pr-4">
            <button
              onClick={() => setFilter('all')}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full transition-shadow transform ${filter==='all'?'bg-black text-white shadow-md hover:shadow-lg':'text-gray-600 dark:text-gray-300 hover:shadow-sm hover:scale-[1.02]'}`}
            >
              <span className="text-sm">Todos</span>
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full transition-shadow transform ${filter==='open'?'bg-green-500 text-white shadow-md hover:shadow-lg':'text-gray-600 dark:text-gray-300 hover:shadow-sm hover:scale-[1.02]'}`}
            >
              <span className="text-sm">Abiertos</span>
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full transition-shadow transform ${filter==='resolved'?'bg-blue-500 text-white shadow-md hover:shadow-lg':'text-gray-600 dark:text-gray-300 hover:shadow-sm hover:scale-[1.02]'}`}
            >
              <span className="text-sm">Resueltos</span>
            </button>
            <button
              onClick={() => setFilter('archived')}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full transition-shadow transform ${filter==='archived'?'bg-red-500 text-white shadow-md hover:shadow-lg':'text-gray-600 dark:text-gray-300 hover:shadow-sm hover:scale-[1.02]'}`}
            >
              <span className="text-sm">Archivados</span>
            </button>
            <span className="flex-shrink-0 w-3" aria-hidden="true"></span>
          </div>
          <button onClick={handleLogout} className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm hover:shadow-md transition">Cerrar sesión</button>
        </div>
      </div>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="flex flex-col gap-6">
          {filtered.map(t => (
            <div key={t.id} className="w-full p-4 rounded-xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-gray-900 flex flex-col justify-between gap-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <div className={`w-1 rounded-full mt-2 sm:mt-0 ${t.status === 'open' ? 'bg-green-500' : t.status === 'resolved' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm opacity-60">{new Date(t.created_at).toLocaleString()}</div>
                      <div className="font-black text-lg">{t.discord_tag}</div>
                      <div className="inline-block mt-1 text-xs px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-black/70">{t.category}</div>
                    </div>
                    <div className={`text-xs font-black px-3 py-1 rounded-full ${t.status === 'open' ? 'bg-green-100 text-green-800' : t.status === 'resolved' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{t.status}</div>
                  </div>
                  <div className="mt-3 text-sm opacity-80 whitespace-pre-wrap p-3 bg-black/5 dark:bg-white/5 rounded-md">{t.description}</div>
                  {t.attachment_urls && t.attachment_urls.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {t.attachment_urls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt={`attachment-${i}`} className="w-full h-32 object-cover rounded-md border" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                {t.status !== 'resolved' && t.status !== 'archived' && (
                  <button
                    onClick={() => updateStatus(t, 'resolved')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <span className="material-icons-outlined text-base">check_circle</span>
                    <span>Marcar resuelto</span>
                  </button>
                )}
                {t.status !== 'archived' && (
                  <button
                    onClick={() => confirmArchive(t)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    <span className="material-icons-outlined text-base">archive</span>
                    <span>Archivar</span>
                  </button>
                )}
                {(t.status === 'resolved' || t.status === 'archived') && (
                  <button
                    onClick={() => updateStatus(t, 'open')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <span className="material-icons-outlined text-base">replay</span>
                    <span>Reabrir</span>
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-sm opacity-60">No hay tickets.</div>}
        </div>
      )}
    </div>
  );
};

export default TicketsAdmin;
