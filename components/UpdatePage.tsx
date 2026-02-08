import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const UpdatePage: React.FC = () => {
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    const parts = path.split('/').filter(Boolean);
    const slugOrId = parts[1] || parts[0];

    const fetchPost = async () => {
      setLoading(true);
      try {
        // Try by slug first
        let { data, error } = await supabase.from('updates').select('*').eq('slug', slugOrId).maybeSingle();
        if (error) throw error;
        if (!data) {
          // fallback to id (numeric)
          const { data: byId, error: err2 } = await supabase.from('updates').select('*').eq('id', slugOrId).maybeSingle();
          if (err2) throw err2;
          data = byId;
        }
        setPost(data || null);
      } catch (e) {
        console.error(e);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  if (loading) return <div className="p-6">Cargando…</div>;
  if (!post) return <div className="p-6">Actualización no encontrada.</div>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-auto max-h-[60vh] object-contain rounded-2xl mb-6 shadow-md"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="text-sm text-gray-500 mb-6">{post.created_at ? new Date(post.created_at).toLocaleString() : ''}</div>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-black px-3 py-2 rounded-md font-semibold hover:opacity-95 transition"
              />
            ),
            h1: ({ node, ...props }) => <h1 {...props} className="text-2xl font-bold mt-4 mb-2" />,
            h2: ({ node, ...props }) => <h2 {...props} className="text-xl font-semibold mt-3 mb-2" />,
            h3: ({ node, ...props }) => <h3 {...props} className="text-lg font-semibold mt-2 mb-1" />,
            p: ({ node, ...props }) => <p {...props} className="mb-3 leading-relaxed" />,
            ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-6 mb-3" />,
            ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-6 mb-3" />,
            li: ({ node, ...props }) => <li {...props} className="mb-1" />,
            strong: ({ node, ...props }) => <strong {...props} className="font-semibold" />,
          }}
        >
          {post.content || ''}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default UpdatePage;
