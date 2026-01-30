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
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [section, setSection] = useState<'overview' | 'tickets' | 'control'>('overview');

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
      setTickets((data as Ticket[]) || []);
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

  const deleteTicket = async (t: Ticket) => {
    if (!confirm('¿Eliminar este ticket? Esta acción no se puede deshacer.')) return;
    try {
      const { error } = await supabase.from('tickets').delete().eq('id', t.id);
      if (error) {
        console.error('Error deleting ticket', error);
        alert('Error al eliminar el ticket');
        return;
      }
      setTickets(prev => prev.filter(p => p.id !== t.id));
    } catch (err) {
      console.error('Error deleting ticket', err);
      alert('Error al eliminar el ticket');
    }
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-extrabold">GM</div>
            <div>
              <h3 className="text-2xl font-extrabold">Acceso Admin</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Introduce la contraseña para acceder al panel</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Contraseña"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-500">
                <input type="checkbox" className="w-4 h-4" />
                <span>Recordarme</span>
              </label>
              <button type="button" onClick={() => setPasswordInput('')} className="text-sm text-slate-500 hover:underline">Limpiar</button>
            </div>

            <div>
              <button className="w-full py-3 bg-primary text-black rounded-xl font-semibold hover:shadow-md transition">Entrar</button>
            </div>

            {!ADMIN_PASS && (
              <div className="text-sm text-yellow-700">Nota: VITE_ADMIN_PASSWORD no está configurada; establece la variable en `.env.local`.</div>
            )}
          </form>
        </div>
      </div>
    );
  }

  const counts = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    archived: tickets.filter(t => t.status === 'archived').length,
  };

  const today = new Date();
  const isSameDay = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  };
  const newToday = tickets.filter(t => t.status === 'open' && isSameDay(t.created_at)).length;

  const ticketsHeader = (() => {
    if (filter === 'open') return 'Tickets Recientes — Abiertos';
    if (filter === 'resolved') return 'Tickets Recientes — Resueltos';
    if (filter === 'archived') return 'Tickets Recientes — Archivados';
    return 'Tickets Recientes';
  })();

  const filtered = tickets
    .filter(t => {
      if (filter === 'all') return t.status !== 'archived' && t.status !== 'resolved';
      if (filter === 'open') return t.status === 'open';
      if (filter === 'resolved') return t.status === 'resolved';
      if (filter === 'archived') return t.status === 'archived';
      return true;
    })
    .filter(t => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (t.discord_tag || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q)
      );
    });

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Panel de administración</p>
        </div>
        <nav className="flex-1 space-y-1">
          <button type="button" onClick={() => setSection('overview')} className={`flex items-center gap-3 w-full text-left px-6 py-3 ${section === 'overview' ? 'bg-slate-900 text-white rounded-xl' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl'} font-medium transition-all`}>
            <span className="material-icons-round text-[20px]">dashboard</span>
            Overview
          </button>
          <button type="button" onClick={() => { setSection('tickets'); setFilter('open'); }} className={`flex items-center gap-3 w-full text-left px-6 py-3 ${(section === 'tickets' && filter === 'open') ? 'bg-slate-900 text-white rounded-xl' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl'} font-medium transition-all group`}>
            <span className="material-icons-round text-[20px] text-slate-400 group-hover:text-slate-600">confirmation_number</span>
            Tickets abiertos
          </button>
          <button type="button" onClick={() => { setSection('tickets'); setFilter('resolved'); }} className={`flex items-center gap-3 w-full text-left px-6 py-3 ${(section === 'tickets' && filter === 'resolved') ? 'bg-slate-900 text-white rounded-xl' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl'} font-medium transition-all group`}>
            <span className="material-icons-round text-[20px] text-slate-400 group-hover:text-slate-600">check_circle</span>
            Resueltos
          </button>
          <button type="button" onClick={() => { setSection('tickets'); setFilter('archived'); }} className={`flex items-center gap-3 w-full text-left px-6 py-3 ${(section === 'tickets' && filter === 'archived') ? 'bg-slate-900 text-white rounded-xl' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl'} font-medium transition-all group`}>
            <span className="material-icons-round text-[20px] text-slate-400 group-hover:text-slate-600">archive</span>
            Archivados
          </button>
        </nav>
        <div className="mt-auto space-y-4 px-6">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-medium hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all">
            <span className="material-icons-round text-[20px]">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              {section === 'overview' && (
                <>
                  <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Resumen rápido del estado del servidor y tickets</p>
                </>
              )}
              {section === 'tickets' && (
                <>
                  <h1 className="text-3xl font-bold tracking-tight">Panel Admin</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Gestión de tickets y control del servidor</p>
                </>
              )}
              {section === 'control' && (
                <>
                  <h1 className="text-3xl font-bold tracking-tight">Panel de control</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Acceso a la consola del servidor</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchTickets} className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                <span className="material-icons-round text-[18px]">refresh</span>
                Actualizar
              </button>
              <button onClick={() => window.open('https://panel.holy.gg/server/aa440686/console', '_blank')} className="px-5 py-2.5 bg-primary text-black rounded-xl font-bold shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2">
                Ir al panel de control
                <span className="material-icons-round text-[18px]">arrow_forward</span>
              </button>
            </div>
          </header>

          {section === 'tickets' && (
            <div className="relative mb-8 group">
              <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors">search</span>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-lg" placeholder="Buscar por usuario, descripción o categoría..." type="text" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Abiertos</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{counts.open}</span>
                {newToday > 0 && (
                  <span className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">+{newToday} hoy</span>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Resueltos</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{counts.resolved}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Archivados</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{counts.archived}</span>
              </div>
            </div>
          </div>

          {section === 'tickets' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{ticketsHeader}</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
                  <span className="material-icons-round">filter_list</span>
                </button>
                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
                  <span className="material-icons-round">more_vert</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div>Cargando...</div>
              ) : (
                <>
                  {filtered.map(t => (
                    <article key={t.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-medium text-slate-400">{new Date(t.created_at).toLocaleString()}</span>
                            <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full uppercase tracking-tight">{t.status}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <h4 className="text-xl font-bold">{t.discord_tag}</h4>
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase rounded tracking-widest">{t.category}</span>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-slate-700 dark:text-slate-300 italic border-l-4 border-primary/30">"{t.description}"</div>
                        </div>
                        <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[160px]">
                          {t.status !== 'resolved' && t.status !== 'archived' && (
                            <button onClick={() => updateStatus(t, 'resolved')} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-sm flex items-center justify-center gap-2">
                              <span className="material-icons-round text-[18px]">done_all</span>
                              Marcar resuelto
                            </button>
                          )}
                          {t.status !== 'archived' && (
                            <button onClick={() => confirmArchive(t)} className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors shadow-sm flex items-center justify-center gap-2">
                              <span className="material-icons-round text-[18px]">archive</span>
                              Archivar
                            </button>
                          )}
                          {t.status === 'archived' && (
                            <button onClick={() => updateStatus(t, 'open')} className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors shadow-sm flex items-center justify-center gap-2">
                              <span className="material-icons-round text-[18px]">unarchive</span>
                              Desarchivar
                            </button>
                          )}
                          <button onClick={() => deleteTicket(t)} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
                            <span className="material-icons-round">delete</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}

                  {filtered.length === 0 && (
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400">
                      <span className="material-icons-round text-5xl mb-3 opacity-20">hourglass_empty</span>
                      <p className="font-medium">No hay más tickets pendientes</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default TicketsAdmin;
