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

  const toggleStatus = async (t: Ticket) => {
    const newStatus = t.status === 'open' ? 'closed' : 'open';
    const { error } = await supabase.from('tickets').update({ status: newStatus }).eq('id', t.id);
    if (error) {
      console.error('Error updating ticket', error);
    } else {
      setTickets((prev) => prev.map(p => p.id === t.id ? { ...p, status: newStatus } : p));
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

  return (
    <div className="p-8 bg-white dark:bg-bg-dark rounded-2xl border border-black/5 dark:border-white/5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black">Panel de Tickets (Admin)</h3>
        <div className="flex items-center gap-2">
          <button onClick={handleLogout} className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded">Cerrar sesión</button>
        </div>
      </div>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="space-y-4">
          {tickets.map(t => (
            <div key={t.id} className="p-4 rounded-xl border border-black/5 dark:border-white/5 flex justify-between items-start gap-4">
              <div>
                <div className="text-sm opacity-60">{new Date(t.created_at).toLocaleString()}</div>
                <div className="font-black text-lg">{t.discord_tag} <span className="text-xs opacity-60">• {t.category}</span></div>
                <div className="mt-2 text-sm opacity-80 whitespace-pre-wrap">{t.description}</div>
                {t.attachment_urls && t.attachment_urls.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {t.attachment_urls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                        <img src={url} alt={`attachment-${i}`} className="w-40 h-auto rounded-md border" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`text-xs font-black px-3 py-1 rounded-full ${t.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{t.status}</div>
                <button onClick={() => toggleStatus(t)} className="px-3 py-2 bg-black text-white rounded-md text-sm">Toggle</button>
              </div>
            </div>
          ))}
          {tickets.length === 0 && <div className="text-sm opacity-60">No hay tickets.</div>}
        </div>
      )}
    </div>
  );
};

export default TicketsAdmin;
