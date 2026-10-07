import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl) {
  throw new Error("Erreur critique : La variable d'environnement NEXT_PUBLIC_SUPABASE_URL est introuvable.")
}

if (!supabaseKey) {
  throw new Error("Erreur critique : La clé Supabase (ANON_KEY ou PUBLISHABLE_KEY) est introuvable.")
}

export const supabase = createClient(supabaseUrl, supabaseKey)