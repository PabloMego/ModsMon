import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

(async function generate() {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const SITE_ORIGIN = process.env.SITE_ORIGIN || process.env.VITE_SITE_ORIGIN || 'https://your-site.example';

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('Skipping OG generation: SUPABASE_URL or SUPABASE_KEY not set');
    return;
  }

  try {
    const endpoint = `${SUPABASE_URL.replace(/\/+$/,'')}/rest/v1/updates?select=*&order=created_at.desc`;
    const res = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!res.ok) {
      console.error('Failed fetching posts for OG generation', await res.text());
      return;
    }

    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) {
      console.log('No posts found for OG generation');
      return;
    }

    const publicDir = path.resolve(process.cwd(), 'public', 'updates');
    await mkdir(publicDir, { recursive: true });

    for (const post of posts) {
      const slug = post.slug || post.id;
      const dir = path.join(publicDir, String(slug));
      await mkdir(dir, { recursive: true });
      const title = escapeHtml(post.title || 'Actualización');
      const description = escapeHtml((post.content || '').slice(0, 200));
      // Use relative post URL so browsers are redirected within the same origin
      const postUrl = `/updates/${encodeURIComponent(slug)}`;

      // Prefer absolute image URLs when possible; if image_url is relative and SITE_ORIGIN is set,
      // build an absolute URL, otherwise fall back to a site-root relative path (/og-default.png)
      let image = `/og-default.png`;
      if (post.image_url) {
        if (/^https?:\/\//i.test(post.image_url)) image = post.image_url;
        else if (SITE_ORIGIN) image = absoluteUrl(post.image_url, SITE_ORIGIN);
        else image = post.image_url.startsWith('/') ? post.image_url : `/${post.image_url}`;
      }

      const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${SITE_ORIGIN ? SITE_ORIGIN.replace(/\/+$/,'') + postUrl : postUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="${postUrl}" />
  <title>${title}</title>
</head>
<body>
  Redirecting to <a href="${postUrl}">${postUrl}</a>
</body>
</html>`;

      await writeFile(path.join(dir, 'index.html'), html, { encoding: 'utf8' });
      console.log('Generated OG page for', slug);
    }

    console.log('OG generation complete');
  } catch (err) {
    console.error('OG generation error', err);
  }
})();

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function absoluteUrl(u, origin) {
  if (!u) return u;
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return `${origin.replace(/\/+$/,'')}/${u.replace(/^\/+/, '')}`;
}
