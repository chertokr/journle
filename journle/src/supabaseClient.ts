import { createClient } from '@supabase/supabase-js';

// Make sure to replace these with your actual values
const supabaseUrl = 'https://qkhsljpefatryynbimyr.supabase.co'; // Replace with your actual Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFraHNsanBlZmF0cnl5bmJpbXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMTc5OTcsImV4cCI6MjA1MDg5Mzk5N30.DNK8uewirS8eNBSaDiWFwNJIhsLH9-lmMMHkV3wQbks'; // Replace with your actual Supabase key

// Create a new Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey);