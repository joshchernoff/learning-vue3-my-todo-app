import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = 'https://ebcbuqjetncpuyvwquvp.supabase.co';
const supabaseKey: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViY2J1cWpldG5jcHV5dndxdXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAwMjM2NzIsImV4cCI6MjAzNTU5OTY3Mn0.YyZhIhzkGt4Xqb2TlpCps97VNRxxBU6UPghfl79fT9M';
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
