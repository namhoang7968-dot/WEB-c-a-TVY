import { createClient } from '@supabase/supabase-js';

// Default credentials provided for GSA Creator Studio
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://vmksmalbkveanjnqqivr.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZta3NtYWxia3ZlYW5qbnFxaXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5MjY3MTUsImV4cCI6MjExMDUwMjcxNX0.m2rBmq_oAjbz6uQ6Fpzqis3ROKpSRvXlYs7Svj_Ngh0'
};

// Singleton Supabase Client
export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

export const getSupabaseClient = () => supabase;

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
};
