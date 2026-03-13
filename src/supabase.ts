import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://whvpwobyxmmoechgoziz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndodnB3b2J5eG1tb2VjaGdveml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTg1MjAsImV4cCI6MjA4ODc5NDUyMH0.S5C0rXeQfs9XmIq8JmjpQfWyeLhlqcSzfH3zfnXZzLU'

export const supabase = createClient(supabaseUrl, supabaseKey); 