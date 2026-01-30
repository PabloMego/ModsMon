import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

interface Ticket {
  id: number;
  category: string;
  discord_tag: string;
  description: string;
  status: string;
  created_at: string;
}

const TicketsAdmin: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

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
    fetchTickets();
    const interval = setInterval(fetchTickets, 15000);
    return () => clearInterval(interval);
  }, []);

  const toggleStatus = async (t: Ticket) => {
    const newStatus = t.status === 'open' ? 'closed' : 'open';
    const { error } = await supabase.from('tickets').update({ status: newStatus }).eq('id', t.id);
    if (error) {
      console.error('Error updating ticket', error);
    } else {
      setTickets((prev) => prev.map(p => p.id === t.id ? { ...p, status: newStatus } : p));
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-bg-dark rounded-2xl border border-black/5 dark:border-white/5">
      <h3 className="text-2xl font-black mb-6">Panel de Tickets (Admin)</h3>
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
