import React, { useEffect, useState } from 'react';
import UpdateCard from './UpdateCard';
import { supabase } from '../services/supabase';

interface UpdateRow {
  id: number;
  slug?: string | null;
  title: string;
  content: string;
  image_url?: string | null;
  created_at?: string | null;
}

const Updates: React.FC = () => {
  const [posts, setPosts] = useState<UpdateRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase fetch error', error);
        setPosts([]);
      } else {
        setPosts((data as UpdateRow[]) || []);
      }
    } catch (e) {
      console.error(e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('public:updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'updates' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      try {
        // unsubscribe
        // @ts-ignore
        if (channel && channel.unsubscribe) channel.unsubscribe();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Actualizaciones</h2>
      {loading ? (
        <div>Loading…</div>
      ) : posts.length === 0 ? (
        <div>No hay actualizaciones todavía.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((p) => (
            <UpdateCard key={p.id} id={p.id} slug={p.slug || undefined} title={p.title} content={p.content} image_url={p.image_url} created_at={p.created_at} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Updates;
