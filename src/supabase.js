import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xrcybequymsqqfuetvwv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyY3liZXF1eW1zcXFmdWV0dnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExOTgxNDksImV4cCI6MjEwNjc3NDE0OX0.zWZTxlaBCMFp_UZPmbZz5Um-oiwAf4nEMpfU8z2sdqE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
