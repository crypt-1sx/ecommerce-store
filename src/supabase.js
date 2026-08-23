import { createClient } from "@supabase/supabase-js";
const env = (typeof import.meta !== "undefined" && import.meta.env) ? import.meta.env : {};
const url = env.VITE_SUPABASE_URL || "https://szyhiodfyewstrlvnlvg.supabase.co";
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || "sb_publishable_KVWB-Cfug9OrUxtIMQZWXA_21juYEeM";
let supabase = null;
let isSupabaseConfigured = false;
try { supabase = createClient(url, key); isSupabaseConfigured = Boolean(url && key); } catch (e) { console.warn("supabase init failed", e); supabase = null; isSupabaseConfigured = false; }
export { supabase, isSupabaseConfigured };
