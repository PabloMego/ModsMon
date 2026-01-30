Supabase setup

1) Crear proyecto en Supabase
2) Crear tabla `tickets` con columnas:
   - id (int8) primary key auto increment
   - category text
   - discord_tag text
   - description text
   - status text
   - attachment_urls text[]   # o text JSON si prefieres
   - created_at timestamptz default now()

3) (Opcional) Crear bucket en Supabase Storage llamado `ticket-attachments` y dar permisos de lectura pública o ajustar políticas según tu RLS.

3) Añadir variables de entorno en `.env.local` (local) y en Vercel:
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=public-anon-key
   VITE_ADMIN_PASSWORD=tu_contraseña_admin

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
