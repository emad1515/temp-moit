import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://uzxkqlgdyjyqoooqyaae.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6eGtxbGdkeWp5cW9vb3F5YWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQzNjI2NTEsImV4cCI6MjAwOTkzODY1MX0.xE_iSfshhRdI582gLtmxUJoMugOzf1TTnJQ09mv2gEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
