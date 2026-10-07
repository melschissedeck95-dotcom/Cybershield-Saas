import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''

// Pendant le build Next.js (côté serveur), si les variables manquent, on fournit un dummy temporaire pour laisser passer le build.
// Dès que l'application tourne dans le navigateur, les vraies variables de Vercel prennent le relais.
const effectiveUrl = supabaseUrl || 'https://placeholder-project.supabase.co'
const effectiveKey = supabaseKey || 'placeholder-key'

export const supabase = createClient(effectiveUrl, effectiveKey)