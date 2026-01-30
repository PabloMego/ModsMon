import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

let supabase: any = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
	supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
	// Provide a safe stub when env vars are missing so app doesn't crash in dev
	const stubError = { message: 'Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local' };

	const stubQuery = {
		select: () => ({ order: async () => ({ data: null, error: stubError }) }),
		insert: async () => ({ data: null, error: stubError }),
		update: () => ({ eq: async () => ({ data: null, error: stubError }) }),
	};

	supabase = {
		from: () => stubQuery,
	};
}

export { supabase };
export default supabase;
