import { createClient } from "@supabase/supabase-js";
const url = import.meta.env.VITE_SUPABASE_URL || "https://szyhiodfyewstrlvnlvg.supabase.co";
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_KVWB-Cfug9OrUxtIMQZWXA_21juYEeM";
export const supabase = createClient(url, key);
export const isSupabaseConfigured = Boolean(url && key);
