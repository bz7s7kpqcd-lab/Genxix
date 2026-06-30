import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://sphhujmxozimplzuhwkk.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGh1am14b3ppbXBsenVod2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1OTU5OTQsImV4cCI6MjA5ODE3MTk5NH0.yBsQRrTP0tdJe_LxxcgOK15Qtlzo4UyBv2qpEBm3Le0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
