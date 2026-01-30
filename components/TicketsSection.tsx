
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const TicketsSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState('bug');
  const [discordTag, setDiscordTag] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [files, setFiles] = useState<File[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const attachment_urls: string[] = [];
      if (files && files.length > 0) {
        for (const f of files) {
          const fileExt = f.name.split('.').pop();
          const fileName = `ticket_${Date.now()}_${Math.random().toString(36).slice(2,8)}.${fileExt}`;
          const { error: upError } = await supabase.storage.from('ticket-attachments').upload(fileName, f, { cacheControl: '3600', upsert: false });
          if (upError) throw upError;
          const { data: publicData } = supabase.storage.from('ticket-attachments').getPublicUrl(fileName) as any;
          const url = publicData?.publicUrl || publicData?.public_url || null;
          if (url) attachment_urls.push(url);
        }
      }

      const payload: any = { category, discord_tag: discordTag, description, status: 'open' };
      if (attachment_urls.length > 0) payload.attachment_urls = attachment_urls;

      const { data, error } = await supabase.from('tickets').insert([payload]);
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      console.error('Ticket submit error', err);
      setErrorMsg(err.message || 'Error al enviar ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tickets" className="py-32 px-6 md:px-16 bg-white dark:bg-bg-dark scroll-mt-20 border-t border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          <div className="sticky top-32">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-primary mb-4 block">Central de Soporte</span>
            <h2 className="hero-title text-7xl md:text-[8vw] font-black lowercase dark:text-white mb-12">
              abrir<br/>ticket
            </h2>
            <p className="text-xl text-black/50 dark:text-white/40 max-w-sm leading-relaxed mb-8">
              ¿Encontraste un bug? ¿Tienes una sugerencia para un nuevo mod? el tonto del pablo revisa cada reporte manualmente.
            </p>
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest opacity-30">
              <span className="material-icons-outlined">info</span>
              Tiempo medio de respuesta: cuando este despierto xD
            </div>
          </div>

          <div className="relative">
            {submitted ? (
              <div className="bg-primary p-12 rounded-[3rem] text-black animate-in zoom-in duration-500">
                <span className="material-icons-outlined text-6xl mb-6">task_alt</span>
                <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter">Ticket Recibido</h3>
                <p className="text-lg font-medium opacity-80 mb-8">
                  Tu reporte ha sido encriptado y enviado a la base de datos de GMM. Mantente atento a Discord para actualizaciones.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-4 bg-black text-white rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-all"
                >
                  Enviar otro
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <label className="text-[10px] font-black uppercase tracking-widest mb-3 block opacity-40 group-focus-within:opacity-100 transition-opacity">Categoría</label>
                  <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border-2 border-transparent focus:border-primary rounded-3xl px-8 py-6 text-lg font-bold outline-none appearance-none cursor-pointer dark:text-white">
                    <option value="bug">Reportar Bug</option>
                    <option value="mod">Sugerencia de Mod</option>
                    <option value="player">Reportar Jugador</option>
                    <option value="tech">Problema Técnico</option>
                  </select>
                </div>

                <div className="group">
                  <label className="text-[10px] font-black uppercase tracking-widest mb-3 block opacity-40 group-focus-within:opacity-100 transition-opacity">Tu Discord Tag</label>
                  <input 
                    required 
                    type="text" 
                    value={discordTag}
                    onChange={(e) => setDiscordTag(e.target.value)}
                    placeholder="ej: steve#0001"
                    className="w-full bg-black/5 dark:bg-white/5 border-2 border-transparent focus:border-primary rounded-3xl px-8 py-6 text-lg font-bold outline-none dark:text-white"
                  />
                </div>

                <div className="group">
                  <label className="text-[10px] font-black uppercase tracking-widest mb-3 block opacity-40 group-focus-within:opacity-100 transition-opacity">Descripción del problema</label>
                  <textarea 
                    required 
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe los detalles aquí..."
                    className="w-full bg-black/5 dark:bg-white/5 border-2 border-transparent focus:border-primary rounded-[2.5rem] px-8 py-6 text-lg font-bold outline-none resize-none dark:text-white"
                  />
                </div>

                <div className="group">
                  <label className="text-[10px] font-black uppercase tracking-widest mb-3 block opacity-40">Adjuntar imágenes (opcional)</label>
                  <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : null)} className="w-full" />
                </div>

                {errorMsg && (
                  <div className="text-sm text-red-600">{errorMsg}</div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-8 rounded-[2.5rem] text-xl font-black uppercase tracking-tighter hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Enviar Ticket
                      <span className="material-icons-outlined group-hover:translate-x-2 transition-transform">north_east</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default TicketsSection;
