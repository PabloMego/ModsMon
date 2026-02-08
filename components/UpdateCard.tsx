import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface UpdateCardProps {
  id: number | string;
  slug?: string;
  title: string;
  content: string;
  image_url?: string | null;
  created_at?: string | null;
}

  const excerpt = (s: string, len = 80) => (s.length > len ? s.slice(0, len).trim() + '…' : s);

const UpdateCard: React.FC<UpdateCardProps> = ({ id, slug, title, content, image_url, created_at }) => {
  const date = created_at ? new Date(created_at).toLocaleString() : '';

  const link = slug ? `/updates/${slug}` : `/updates/${id}`;

  return (
    <a href={link} className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-bg-dark p-0">
      {image_url && (
        <div className="w-full h-48 bg-gray-100 overflow-hidden">
          <img src={image_url} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <div className="text-sm text-muted mb-3 prose prose-sm max-w-none dark:prose-invert" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3 as any, WebkitBoxOrient: 'vertical' as any }}>
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content || ''}</ReactMarkdown>
        </div>
        <div className="text-[11px] text-gray-500">{date}</div>
      </div>
    </a>
  );
};

export default UpdateCard;
