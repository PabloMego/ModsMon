Supabase setup

1) Crear proyecto en Supabase
2) Crear tabla `tickets` con columnas:
   - id (int8) primary key auto increment
   - category text
   - discord_tag text
   - description text
   - status text
   - created_at timestamptz default now()

3) Añadir variables de entorno en `.env.local` (local) y en Vercel:
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=public-anon-key

4) Instalar cliente en el proyecto:

```bash
npm install @supabase/supabase-js
```

5) Uso:
- `TicketsSection` enviará tickets a la tabla `tickets`.
- `components/Admin/TicketsAdmin.tsx` muestra los tickets (panel admin simple).

Notas de seguridad:
- La clave anónima de Supabase puede usarse desde el cliente si configuras RLS (Row Level Security) adecuadamente.
- Para control de permisos y administración más segura, considera crear endpoints server-side.
