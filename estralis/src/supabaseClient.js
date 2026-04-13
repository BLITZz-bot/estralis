import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only initialize if we have valid-looking credentials to prevent app-wide crash
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http')) 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;
