import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { supabase } from '../../services/supabase';

type UpdateRow = {
  id: number;
  title: string;
  content: string;
  image_url?: string | null;
  created_at?: string | null;
};

const UpdatesAdmin: React.FC = () => {
  const [items, setItems] = useState<UpdateRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('updates').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setItems((data as UpdateRow[]) || []);
    } catch (e) {
      console.error(e);
      setMessage('Error al cargar actualizaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel('admin:updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'updates' }, () => {
        fetchItems();
      })
      .subscribe();

    return () => {
      try {
        if (channel && channel.unsubscribe) channel.unsubscribe();
      } catch (e) {}
    };
  }, []);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSlug('');
    setImageUrl('');
    setFile(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const slugify = (s: string) =>
    s
      .toString()
      .normalize('NFKD')
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^a-zA-Z0-9-_.]/g, '') // Remove invalid chars
      .replace(/-+/g, '-') // Collapse dashes
      .replace(/(^-|-$)/g, '')
      .toLowerCase();

  const uploadFileIfNeeded = async () => {
    if (!file) return null;
    try {
      const timestamp = Date.now();
      const path = `updates/${timestamp}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage.from('updates').upload(path, file);
      if (uploadError) {
        console.error('Upload error', uploadError);
        setMessage(`Error al subir la imagen: ${uploadError.message || JSON.stringify(uploadError)}`);
        return null;
      }

      // Try to get a public URL first (works if bucket is public)
      try {
        // getPublicUrl is synchronous in supabase-js v2
        // @ts-ignore
        const urlResult = supabase.storage.from('updates').getPublicUrl((data as any).path);
        const publicUrl = urlResult?.data?.publicUrl;
        if (publicUrl) {
          setImageUrl(publicUrl);
          return publicUrl;
        }
      } catch (e) {
        console.warn('getPublicUrl failed', e);
      }

      // If public URL not available (private bucket), create a signed URL to preview
      try {
        const expiresIn = 60 * 60 * 24 * 7; // 7 days
        const { data: signedData, error: signedError } = await supabase.storage.from('updates').createSignedUrl((data as any).path, expiresIn);
        if (signedError) {
          console.error('Signed URL error', signedError);
          setMessage('Imagen subida pero no se pudo generar la URL pública. Revisa permisos del bucket.');
          return null;
        }
        const signedUrl = signedData?.signedUrl;
        if (signedUrl) {
          setImageUrl(signedUrl);
          return signedUrl;
        }
      } catch (e) {
        console.error('createSignedUrl failed', e);
        setMessage('Imagen subida pero no se pudo generar la URL. Revisa permisos.');
      }

      return null;
    } catch (e) {
      console.error(e);
      // More detailed error handling: if it's an RLS/storage permission issue, inform the admin
      const err: any = e;
      if (err?.message && err.message.toLowerCase().includes('row-level security')) {
        setMessage('Error de permisos al subir la imagen: verifica las políticas RLS o usa una URL.');
      } else {
        setMessage('Error al subir la imagen.');
      }
      return null;
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMessage(null);
    if (!title || !content) {
      setMessage('Título y contenido son obligatorios.');
      return;
    }
    setSaving(true);
    try {
      let finalImageUrl = imageUrl || null;
      if (file) {
        const uploaded = await uploadFileIfNeeded();
        if (uploaded) finalImageUrl = uploaded;
      }

      // Build payload conditionally so we don't send `image_url` if it's null
      const payload: any = { title, content };
      if (finalImageUrl) payload.image_url = finalImageUrl;
      if (slug) payload.slug = slug;

      if (editingId) {
        const { error } = await supabase.from('updates').update(payload).eq('id', editingId);
        if (error) throw error;
        setMessage('Actualización editada.');
      } else {
        const { data: insertData, error } = await supabase.from('updates').insert([payload]);
        if (error) {
          console.error('Insert error', error);
          // Provide actionable messages for common cases
          if (error.message && error.message.includes("Could not find the 'image_url'")) {
            setMessage('La columna `image_url` no existe en la tabla `updates`. Ejecuta el SQL en sql/updates_table.sql para crear la tabla.');
            return;
          }
          // Slug uniqueness error handling
          if (error.code === '23505' || (error.message && error.message.toLowerCase().includes('unique'))) {
            setMessage('El slug ya existe. Modifica el slug para que sea único.');
            return;
          }
          // RLS or other error
          setMessage(`Insert error: ${error.message || JSON.stringify(error)}`);
          return;
        }
        setMessage('Actualización creada.');
      }

      resetForm();
      await fetchItems();
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || JSON.stringify(err);
      setMessage(`Error al guardar la actualización: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: UpdateRow) => {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setSlug(item.slug || '');
    setImageUrl(item.image_url || '');
    setMessage(null);
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm('¿Eliminar esta actualización? Esta acción no se puede deshacer.');
    if (!ok) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('updates').delete().eq('id', id);
      if (error) throw error;
      setMessage('Actualización eliminada.');
      await fetchItems();
    } catch (e) {
      console.error(e);
      setMessage('Error al eliminar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Administrar Actualizaciones</h2>

      <form onSubmit={handleSave} className="bg-white dark:bg-bg-dark p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 gap-4">
          <label className="flex flex-col">
            <span className="font-semibold">Título</span>
            <input value={title} onChange={(e) => { setTitle(e.target.value); if (!editingId) setSlug(slugify(e.target.value)); }} className="mt-1 p-2 border rounded" />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold">Slug (URL)</span>
            <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="autogenerado" className="mt-1 p-2 border rounded" />
            <div className="text-xs text-slate-500 mt-1">El slug se usa en la URL: /updates/&lt;slug&gt; — se genera automáticamente desde el título.</div>
          </label>

          <label className="flex flex-col">
            <span className="font-semibold">Contenido</span>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="mt-1 p-2 border rounded" />
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={() => setPreview((p) => !p)} className="px-3 py-1 border rounded">{preview ? 'Ocultar vista' : 'Vista previa'}</button>
              <div className="text-sm text-slate-500">Soporta Markdown (encabezados, listas, negrita, enlaces).</div>
            </div>
            {preview && (
              <div className="mt-3 prose dark:prose-invert bg-white dark:bg-bg-dark p-3 rounded">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-primary text-black px-2 py-1 rounded font-semibold text-sm hover:opacity-95 transition"
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
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </label>

          <label className="flex flex-col">
            <span className="font-semibold">Imagen (URL o subir archivo)</span>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="mt-1 p-2 border rounded" />
            <div className="mt-2">o</div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-2" />
            {imageUrl && (
              <img src={imageUrl} alt="preview" className="mt-2 h-auto max-h-24 object-contain rounded" />
            )}
            {!imageUrl && file && (
              <div className="mt-2">Seleccionado: {file.name}</div>
            )}
          </label>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="bg-primary text-black px-4 py-2 rounded font-bold">{saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear'}</button>
            <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">Limpiar</button>
            {message && <div className="text-sm text-gray-700">{message}</div>}
          </div>
        </div>
      </form>

      <section>
        <h3 className="text-xl font-bold mb-2">Posts existentes</h3>
        {loading ? (
          <div>Cargando…</div>
        ) : items.length === 0 ? (
          <div>No hay actualizaciones aún.</div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-bg-dark rounded shadow">
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="p-2">Imagen</th>
                  <th className="p-2">Título</th>
                  <th className="p-2">Creado</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="p-2 w-28">
                      {it.image_url ? <img src={it.image_url} className="h-16 w-24 object-cover rounded" alt={it.title} /> : <div className="h-16 w-24 bg-gray-100 rounded flex items-center justify-center text-xs">Sin imagen</div>}
                    </td>
                    <td className="p-2 align-top">{it.title}</td>
                    <td className="p-2 align-top">{it.created_at ? new Date(it.created_at).toLocaleString() : ''}</td>
                    <td className="p-2 align-top">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(it)} className="px-3 py-1 bg-yellow-200 rounded">Editar</button>
                        <button onClick={() => handleDelete(it.id)} className="px-3 py-1 bg-red-200 rounded">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default UpdatesAdmin;
