import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL hoặc Anon Key chưa được cấu hình trong file .env.local (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
