import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NEXT_PUBLIC_SUPABASE_URL=https://njzyqlyrqojhargjypjc.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qenlxbHlycW9qaGFyZ2p5cGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMTM1MjcsImV4cCI6MjEwNjg4OTUyN30.NeSc0nRomC0Q-sEq2SOufbADH18G8-78hekTCS_jzu0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)