import React, { useState } from 'react';
import { supabase } from '../services/supabase';

type Props = {
  latest: any;
};

const UpdateBanner: React.FC<Props> = ({ latest }) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);

  // Detect explicit link inside the post content (Markdown link or plain URL)
  const markdownLinkMatch = latest?.content?.match(/\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/i);
  const plainUrlMatch = latest?.content?.match(/https?:\/\/[^\s)]+/i);
  const contentLink = markdownLinkMatch ? markdownLinkMatch[1] : (plainUrlMatch ? plainUrlMatch[0] : null);

  const hasFile = Boolean(contentLink || latest?.file_url || latest?.file_path || latest?.download_path || latest?.fileKey);

  const handleDownload = async () => {
    if (!hasFile) return;
    setLoading(true);
    try {
      // If the post content contains an explicit link, prefer opening it.
      if (contentLink) {
        window.open(contentLink, '_blank');
        setLoading(false);
        return;
      }
      if (latest.file_url) {
        window.open(latest.file_url, '_blank');
        setLoading(false);
        return;
      }

      // try common fields for storage path
      const path = latest.file_path || latest.download_path || latest.fileKey;
      if (!path) {
        setLoading(false);
        return;
      }

      // Try to get public url
      try {
        const res: any = await supabase.storage.from('updates').getPublicUrl(path);
        const publicUrl = res?.data?.publicUrl || res?.publicUrl || null;
        if (publicUrl) {
          window.open(publicUrl, '_blank');
          setLoading(false);
          return;
        }
      } catch (e) {
        // continue to signed url
      }

      // Fallback: create signed url (1 minute)
      try {
        const signed: any = await supabase.storage.from('updates').createSignedUrl(path, 60);
        const signedUrl = signed?.data?.signedUrl || signed?.signedUrl;
        if (signedUrl) window.open(signedUrl, '_blank');
      } catch (e) {
        // nothing else
      }
    } finally {
      setLoading(false);
    }
  };

  const title = latest?.title || 'Nueva actualización';
  const postUrl = latest?.slug ? `/updates/${encodeURIComponent(latest.slug)}` : `/updates/${latest.id}`;

  if (!visible) return null;

  return (
    <div className="fixed top-20 sm:top-16 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-primary to-indigo-400 text-black px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 max-w-4xl w-[calc(100%_-_1rem)] sm:w-auto">
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-bold text-sm sm:text-base">Nueva actualización</span>
        <span className="text-xs opacity-80 truncate max-w-full sm:max-w-[40ch]">{title}</span>
      </div>

      <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:ml-4">
        <a href={postUrl} className="w-full sm:w-auto bg-black/10 hover:bg-black/20 text-black px-3 py-2 sm:px-3 sm:py-1 rounded-md font-semibold text-center">Ver actualización</a>
        <button
          onClick={handleDownload}
          disabled={!hasFile || loading}
          className={`w-full sm:w-auto px-3 py-2 sm:px-3 sm:py-1 rounded-md font-semibold transition-all ${
            hasFile ? 'bg-white/90 hover:scale-105' : 'bg-white/20 opacity-50 pointer-events-none'
          }`}
        >
          {loading ? 'Preparando...' : 'Descargar actualización'}
        </button>
        <button
          onClick={() => setVisible(false)}
          aria-label="Cerrar aviso"
          className="mt-0 sm:ml-2 text-sm leading-none p-1 rounded-md bg-black/10 hover:bg-black/20"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default UpdateBanner;
