import type { VercelRequest, VercelResponse } from '@vercel/node';

// Serverless function to return an HTML page with Open Graph meta tags for a post.
// Deploy this on Vercel (api/og/updates/[slug]) and optionally rewrite /updates/:slug to this
// endpoint for bot requests so social networks get OG tags.

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SITE_ORIGIN = process.env.SITE_ORIGIN || process.env.VITE_SITE_ORIGIN || 'https://your-site.example';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query as { slug?: string };
  if (!slug) return res.status(400).send('Missing slug');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    const debugMode = req.query?._debug || req.query?.debug;
    if (debugMode) {
      return res.status(200).json({ ok: false, error: 'Supabase not configured on server', hasSupabaseUrl: Boolean(SUPABASE_URL), hasSupabaseKey: Boolean(SUPABASE_KEY), siteOriginConfigured: Boolean(SITE_ORIGIN) });
    }
    return res.status(500).send('Supabase not configured on server');
  }

  try {
    const queryUrl = `${SUPABASE_URL.replace(/\/+$/,'')}/rest/v1/updates?select=*&slug=eq.${encodeURIComponent(
      slug
    )}&limit=1`;

    const r = await fetch(queryUrl, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json'
      },
    });

    if (!r.ok) {
      console.error('Supabase fetch failed', await r.text());
      return res.status(502).send('Failed to fetch post');
    }

    let items: any = null;
    let fetchText = '';
    try {
      fetchText = await r.text();
      items = JSON.parse(fetchText || 'null');
    } catch (e) {
      // keep raw text for debug
      items = null;
    }
    const post = (items && items[0]) || null;

    // Debug mode: return a JSON summary of what happened
    const debugMode = req.query?._debug || req.query?.debug;
    if (debugMode) {
      return res.status(200).json({
        ok: true,
        queryUrl,
        fetchStatus: r.status,
        fetchOk: r.ok,
        fetchBodyPreview: (fetchText || '').slice(0, 400),
        postFound: Boolean(post),
        post: post ? { id: post.id, slug: post.slug, title: post.title, created_at: post.created_at, image_url: post.image_url } : null,
        siteOrigin: SITE_ORIGIN ? SITE_ORIGIN : null,
      });
    }

    if (!post) {
      // Return minimal HTML so scrapers see something, and users get redirected to SPA
      const url = `${SITE_ORIGIN}/updates/${encodeURIComponent(slug)}`;
      return res.status(200).setHeader('content-type', 'text/html').send(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=${url}">
<title>Actualización</title>
</head>
<body>Redirecting to <a href="${url}">${url}</a></body>
</html>`);
    }

    const title = escapeHtml(post.title || 'Nueva actualización');
    const description = escapeHtml((post.content || '').slice(0, 200));
    const image = post.image_url ? absoluteUrl(post.image_url) : `${SITE_ORIGIN}/og-default.png`;
    const postUrl = `${SITE_ORIGIN}/updates/${encodeURIComponent(post.slug || post.id)}`;

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="index,follow" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${postUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <link rel="canonical" href="${postUrl}" />
  <meta http-equiv="refresh" content="0;url=${postUrl}" />
  <title>${title}</title>
</head>
<body>
  Redirecting to <a href="${postUrl}">${postUrl}</a>
</body>
</html>`;

    res.status(200).setHeader('content-type', 'text/html').send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function absoluteUrl(u: string) {
  if (!u) return u;
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  // assume path relative to SITE_ORIGIN
  return `${SITE_ORIGIN.replace(/\/+$/,'')}/${u.replace(/^\/+/, '')}`;
}
