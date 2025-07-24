import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jmygurolntnzytfxzwut.supabase.co/';
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteWd1cm9sbnRuenl0Znh6d3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTM1OTMsImV4cCI6MjA2NjI4OTU5M30.3y8ngbGwgpqtzQXCxJEaj2AS5FVvQ_vc8rgI_6E5k7k";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
